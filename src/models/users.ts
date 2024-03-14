import mongoose, { Schema, Document, CallbackError } from "mongoose";
import { generateKeyPair, SignJWT, jwtVerify } from "jose";

const bcrypt = require("bcrypt");

export interface IRegister extends Document {
  username: string;
  password: string;
  email: string;
  hashedPassword: string;
  registerDate: Date;
  checkPassword: (password: string) => Promise<boolean>;
  isModified: (path: string) => boolean;
  verifyJWT(jwt: string): Promise<any>;
  generateJWT: () => Promise<string>;
  jwt: string;
}

const registerSchema = new Schema<IRegister>(
  {
    password: {
      type: String,
      required: true,
      select: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    hashedPassword: {
      type: String,
      select: false,
    },
    registerDate: {
      type: Date,
      default: Date.now,
    },
    jwt: String,
  },
  {
    collection: "register",
  }
);

// Générer une nouvelle paire de clés lors du démarrage de l'application
let privateKey: any;
let publicKey: any;

generateKeyPair("RS256").then((keys) => {
  privateKey = keys.privateKey;
  publicKey = keys.publicKey;
});

registerSchema.methods.generateJWT = async function () {
  if (!privateKey) {
    throw new Error("Private key is not set");
  }
  // Générer un JWT avec l'identifiant et l'email
  const jwt = await new SignJWT({ sub: this._id, email: this.email })
    // Définir l'en-tête protégé du JWT avec l'algorithme RS256
    .setProtectedHeader({ alg: "RS256" })
    // Définir la date d'expiration du JWT à 30 jours
    .setExpirationTime("30d")
    // Définir la date d'émission du JWT à maintenant
    .setIssuedAt()
    // Signer le JWT avec la clé privée
    .sign(privateKey);
  return jwt;
};

registerSchema.statics.verifyJWT = async function (jwt: string) {
  if (!publicKey) {
    throw new Error("Public key is not set");
  }
  if (!jwt) {
    throw new Error("JWT is not provided");
  }

  try {
    // Vérifier la signature du JWT avec la clé publique et récupérer le payload du JWT (sub et username)
    const { payload } = await jwtVerify(jwt, publicKey);
    // convertit le payload du JWT en objet JavaScript et le renvoie
    return JSON.parse(payload.toString());
  } catch (err) {
    console.error("Invalid JWT:", err);
    return null;
  }
};

registerSchema.pre("save", async function (next) {
  const user = this as IRegister;

  // Hash password only if it has been modified or is new
  if (!user.isModified("password")) {
    return next();
  }

  try {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.hashedPassword = hashedPassword; // Update hashedPassword field
    console.log("Password hashed successfully:", hashedPassword);
    next();
  } catch (err: any) {
    console.error("Error hashing password:", err);
    next(err as CallbackError);
  }
});

registerSchema.methods.checkPassword = async function (password: string) {
  const user = this as IRegister;
  try {
    console.log("Entered checkPassword method");
    console.log("Provided password:", password);
    console.log("Stored hashed password:", user.hashedPassword);
    const hashedPassword = user.hashedPassword;
    const same = await bcrypt.compare(password, hashedPassword);
    console.log("Password comparison result:", same);
    return same;
  } catch (err) {
    console.error("Error in checkPassword:", err);
    throw err;
  }
};

const Register = mongoose.model<IRegister>("Register", registerSchema);

export default Register;
