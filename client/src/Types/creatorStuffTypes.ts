import { iCart } from './wishListTypes';

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

export interface iCreatorProfile {
  creator_name: string;
  username: string;
  creator_bio: string;
  creator_id: string;
  profile_image: string;
  cover_image: string;
  is_stripe_connected: string;
}

export interface iCreatorDataProvider {
  creatorInfo: iCreatorProfile;
  creatorSocialLinks: iCreatorSocialLinks[];
  creatorWishes: iCart[];
  selectedFilter: string;
  setSelectedFilter: React.Dispatch<React.SetStateAction<string>>;
  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
  getCategories: string[];
  displayCategories: boolean;
  setDisplayCategories: React.Dispatch<React.SetStateAction<boolean>>;
  displayFilters: boolean;
  setDisplayFilters: React.Dispatch<React.SetStateAction<boolean>>;
  filteredAndSortedWishes: iCart[];
  errLoadingWishes: string;
  displayedSocialLinks: iCreatorSocialLinks[];
  setDisplayedSocialLinks: React.Dispatch<React.SetStateAction<iCreatorSocialLinks[]>>;
  refreshCreatorData: boolean;
  setRefreshCreatorData: React.Dispatch<React.SetStateAction<boolean>>;
}