import Register from "../models/users";
import { IRegister } from "../models/users";

class LoginController {
  static async login(
    email: string,
    password: string
  ): Promise<{ user: IRegister; jwt: string; email: string } | null> {
    try {
      const register = await Register.findOne({ email }).select(
        "+hashedPassword"
      );

      if (!register) {
        console.log("User not found with email:", email);
        return null; // L'utilisateur n'existe pas
      }

      const passwordMatch = await register.checkPassword(password);

      if (passwordMatch) {
        console.log("User logged in successfully:", email);
        const jwt = await register.generateJWT(); // Générer un JWT pour l'utilisateur
        return { user: register, jwt, email }; // Retourner l'utilisateur et le JWT
      } else {
        console.log("Invalid password for user:", email);
        return null;
      }
    } catch (err) {
      console.error("Error during login:", err);
      throw err;
    }
  }
}

export default LoginController;
