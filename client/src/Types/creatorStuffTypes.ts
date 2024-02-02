
export interface iCreatorSocialLinks { 
  link_id: string;
  platform_icon: string;
  platform_name: string;
  platform_link: string;
}

export interface registrationInfo { 
  creator_name: string;
  email: string;
  password: string;
}

export interface loginInfo { 
  email: string;
  pwd: string;
}

export interface iUserInfo {
  cover_photo: File | undefined | string;
  profile_photo: File | undefined | string;
  profile_name: string;
  profile_username: string;
  profile_bio: string;
}

export interface iLocalUser {
  creator_id: string;
  username: string;
  role: string;
}

export interface iCreatorProfile {
  creator_name: string;
  username: string;
  creator_bio: string;
  creator_id: string;
  profile_image: string;
  cover_image: string;
  is_stripe_connected: boolean;
}