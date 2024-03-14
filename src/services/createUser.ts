import { IRegister } from "../models/users";
import Register from "../models/users";
import Profile from "../models/profile";
import { IProfile } from "../models/profile";
import ProfileService from "./profile";

class CreateUser {
  async createRegister(password: string, email: string): Promise<IRegister> {
    const newRegister = new Register({
      password,
      email,
    });
    const savedRegister = await newRegister.save(); // Sauvegarder d'abord le nouvel utilisateur

    const profileData: Partial<IProfile> = {
      userId: savedRegister._id, // Utiliser l'ID du nouvel utilisateur
      firstname: "",
      lastname: "",
      genre: "",
      street: "",
      houseNumber: "",
      city: "",
      country: "",
    };
    await ProfileService.createOrUpdateProfile(profileData); // Utiliser la méthode correcte de ProfileService

    const jwt = await savedRegister.generateJWT();
    savedRegister.jwt = jwt;

    return await savedRegister.save();
  }
  async createOrUpdateProfile(profileData: IProfile) {
    const profile = await Profile.findOneAndUpdate(
      { userId: profileData.userId }, // critère de recherche
      profileData, // nouvelles données
      { new: true, upsert: true } // options
    );

    // Renvoie le profil complet après sa création ou sa mise à jour
    return profile;
  }

  async getAllRegisters(): Promise<IRegister[]> {
    return await Register.find();
  }
  async getUser(id: string) {
    return await Register.findById(id);
  }
  // à modifier : désactiver l'utilisateur au lieu de le supprimer
  async deleteUser(id: string): Promise<boolean> {
    try {
      const user = await Register.findByIdAndUpdate(id, { isActive: false });
      // Vérifier si un utilisateur a été mis à jour
      if (user) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      throw new Error("Error deleting user");
    }
  }
}

export default CreateUser;
