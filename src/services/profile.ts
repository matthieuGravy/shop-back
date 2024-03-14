import Profile, { IProfile } from "../models/profile";

class ProfileService {
  static createOrUpdateProfile(profileData: Partial<IProfile>) {
    return Profile.createOrUpdateProfile(profileData);
  }
  static getProfile(userId: string) {
    return Profile.getProfile(userId);
  }
}

export default ProfileService;
