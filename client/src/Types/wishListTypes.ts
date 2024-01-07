export interface iWishInfo {
  wish_name: string;
  wish_image: File | undefined ;
  wish_price: string;
  wish_category: string;
}

export interface iUserInfo {
  cover_photo: File | undefined;
  profile_photo: File | undefined;
  profile_name: string;
  profile_username: string;
  profile_bio: string;
}

export interface iWish {
  wish_name: string;
  wish_image: string | undefined | File;
  wish_price: string;
  wish_category: string;
  wish_id: string;
}