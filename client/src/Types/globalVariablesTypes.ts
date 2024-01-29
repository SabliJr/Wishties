import { cartProps, iCart } from "./wishListTypes";
import { iCreatorProfile, iCreatorSocialLinks } from "./creatorStuffTypes";

export interface iGlobalValues { 
  userEmail: string | undefined;
  setUserEmail: React.Dispatch<React.SetStateAction<string>>;
  reverificationSuccess: string;
  setReverificationSuccess: React.Dispatch<React.SetStateAction<string>>;
  serverErrMsg: string;
  setServerErrMsg: React.Dispatch<React.SetStateAction<string>>;
  cartItems: cartProps;
  setCartItems: React.Dispatch<React.SetStateAction<cartProps>>;
  cartTotalQuantity: number,
  cartTotalAmount: number,
  creatorInfo: iCreatorProfile;
  setCreatorInfo: React.Dispatch<React.SetStateAction<iCreatorProfile>>;
  creatorWishes: iCart[];
  setCreatorWishes: React.Dispatch<React.SetStateAction<iCart[]>>;
  creatorSocialLinks: iCreatorSocialLinks[];
  setCreatorSocialLinks: React.Dispatch<React.SetStateAction<iCreatorSocialLinks[]>>;
  selectedFilter: string;
  setSelectedFilter: React.Dispatch<React.SetStateAction<string>>;
  displayFilters: boolean;
  setDisplayFilters: React.Dispatch<React.SetStateAction<boolean>>;
  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
  displayCategories: boolean;
  setDisplayCategories: React.Dispatch<React.SetStateAction<boolean>>;
  getCategories: string[];
  setGetCategories: React.Dispatch<React.SetStateAction<string[]>>;
  filteredAndSortedWishes: iCart[];
  isPublicDataLoading: boolean;
  refetchCreatorData: boolean;
  setRefetchCreatorData: React.Dispatch<React.SetStateAction<boolean>>;
  displayedSocialLinks: iCreatorSocialLinks[];
  setDisplayedSocialLinks: React.Dispatch<React.SetStateAction<iCreatorSocialLinks[]>>;
  showProfile: boolean;
  setShowProfile: React.Dispatch<React.SetStateAction<boolean>>;
}