export interface iCreatorSocialLinks { 
  icon: string;
  platform: string;
  platformLinks: string;
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

export interface iGlobalValues { 
  userEmail: string | undefined;
  setUserEmail: React.Dispatch<React.SetStateAction<string>>;
}