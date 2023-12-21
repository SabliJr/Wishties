export interface iWishInfo {
  name: string;
  image: File | undefined;
  category: string;
  wishPrice?: string;
  price: number | null;
}

export interface iUserInfo {
  coverPhoto: string;
  profilePhoto: string;
  profileName: string;
  userName: string;
  userBio: string;
}