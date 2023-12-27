export interface iWishInfo {
  wish_name: string;
  wish_image: File | undefined;
  wish_price: string;
  wish_category: string;
}

export interface iUserInfo {
  coverPhoto: string;
  profilePhoto: string;
  profileName: string;
  userName: string;
  userBio: string;
}