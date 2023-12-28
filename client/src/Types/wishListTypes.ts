export interface iWishInfo {
  wish_name: string;
  wish_image: File | undefined;
  wish_price: string;
  wish_category: string;
}

export interface iUserInfo {
  cover_photo?: string;
  profile_photo?: string;
  profile_name?: string;
  user_name?: string;
  user_bio?: string;
}