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

export interface iErrorMsgs { 
  fieldsEmpty: string;
  termsNotChecked: string;
  validPwdErr: string;
  validEmailErr: string;
  validMatchErr: string;
  emailExistsErr: string;
  theNameErr: string;
}

export interface iCart {
created_date: null | string | number;
creator_id: string;
deleted_at: null | string | number;
purchased: boolean;
wish_category: string | null;
wish_id: string;
wish_image: string;
wish_name: string;
wish_price: number;
  wish_type: string | null;
  quantity: number;
}

export type cartProps = {
  cart: iCart[];
  cartTotalQuantity: number;
  cartTotalAmount: number;
};
export interface iGlobalValues { 
  userEmail: string | undefined;
  setUserEmail: React.Dispatch<React.SetStateAction<string>>;
  reverificationSuccess: string;
  setReverificationSuccess: React.Dispatch<React.SetStateAction<string>>;
  serverErrMsg: string;
  setServerErrMsg: React.Dispatch<React.SetStateAction<string>>;
  refresh: boolean;
  setRefresh: (value: any) => boolean;
  cartItems: cartProps;
  setCartItems: React.Dispatch<React.SetStateAction<cartProps>>;
  cartTotalQuantity: number,
  cartTotalAmount: number,
}

export interface iAuthContext {
  userEmail: string | undefined;
  setUserEmail: React.Dispatch<React.SetStateAction<string>>;
  reverificationSuccess: string;
  setReverificationSuccess: React.Dispatch<React.SetStateAction<string>>;
  serverErrMsg: string;
  setServerErrMsg: React.Dispatch<React.SetStateAction<string>>;
  handleRegistration: (registrationInfo: registrationInfo) => void;
  handleLogin: (loginInfo: loginInfo) => void;
  handleLogout: () => void;
  handleReverification: (email: string) => void;
  handleResendVerification: (email: string) => void;
}

export interface iAuth {
  userId: string;
  username: string;
  accessToken: string;
}