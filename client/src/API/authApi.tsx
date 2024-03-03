import axios from "axios";
import {
  registrationInfo,
  loginInfo,
  iCreatorSocialLinks,
} from "../Types/creatorStuffTypes";
import { iPurchaseDetails } from "../Types/wishListTypes";

// const SERVER_URL = "http://localhost:8000/api";
const SERVER_URL =
  process.env?.NODE_ENV === "production"
    ? "https://api.wishties.com/api"
    : "http://localhost:8000/api";

const onRegistration = async (registrationData: registrationInfo) => {
  return await axios.post(
    `${SERVER_URL}/register`,
    JSON.stringify(registrationData),
    {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    }
  );
};

const onRequestVerificationAgain = async (email: string) => {
  return await axios.post(
    `${SERVER_URL}/request-verification-again`,
    JSON.stringify({ email }),
    {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    }
  );
};

const onSignUpWithGoogle = async (token: string) => {
  return await axios.get(`${SERVER_URL}/auth/google/callback`, {
    headers: {
      "Content-Type": "application/json",
    },
    params: { token }, // Passing the token as a query parameter
    withCredentials: true,
  });
};

const onVerifyEmail = async (token: string) => {
  return await axios.get(`${SERVER_URL}/verify-email`, {
    headers: {
      "Content-Type": "application/json",
    },
    params: { token }, // Passing the token as a query parameter
    withCredentials: true,
  });
};

const onLogin = async (loginData: loginInfo) => {
  return await axios.post(`${SERVER_URL}/login`, JSON.stringify(loginData), {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
};

const onRefreshToken = async () => {
  return await axios.get(`${SERVER_URL}/refresh-token`, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
};

export const axiosPrivate = axios.create({
  baseURL: SERVER_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

const onLogout = async () => {
  return await axios.get(`${SERVER_URL}/logout`, {
    withCredentials: true,
  });
};

const onAddWish = async (FormData: FormData) => {
  return await axios.post(`${SERVER_URL}/add-wish`, FormData, {
    withCredentials: true,
  });
};

const onRemoveWish = async (wish_id: string) => {
  return await axios.get(`${SERVER_URL}/delete-wish`, {
    headers: {
      "Content-Type": "application/json",
    },
    params: { wish_id },
    withCredentials: true,
  });
};

const onEditWish = async (wish: FormData) => {
  return await axios.put(`${SERVER_URL}/update-wish`, wish, {
    withCredentials: true,
  });
};

const onAddSocialLinks = async (creatorSocialLinks: iCreatorSocialLinks[]) => {
  return await axios.post(
    `${SERVER_URL}/add-social-links`,
    JSON.stringify(creatorSocialLinks),
    {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    }
  );
};

const onDeleteSocialLink = async (link_id: string) => {
  return await axios.get(`${SERVER_URL}/delete-social-link`, {
    headers: {
      "Content-Type": "application/json",
    },
    params: { link_id },
    withCredentials: true,
  });
};

const onUpdateCreatorInfo = async (formData: FormData) => {
  return await axios.put(`${SERVER_URL}/update-user-profile`, formData, {
    withCredentials: true,
  });
};

const onIsUsernameAvailable = async (username: string) => {
  return await axios.get(`${SERVER_URL}/check-username`, {
    headers: {
      "Content-Type": "application/json",
    },
    params: { username },
    withCredentials: true,
  });
};

const onGetCreatorInfo = async (username: string) => {
  return await axios.get(`${SERVER_URL}/creator`, {
    headers: {
      "Content-Type": "application/json",
    },
    params: { username },
    withCredentials: true,
  });
};

const onGetUserInfos = async (creator_id: string) => {
  return await axios.get(`${SERVER_URL}/creator-infos`, {
    headers: {
      "Content-Type": "application/json",
    },
    params: { creator_id },
    withCredentials: true,
  });
};

const onGetCreatorData = async () => {
  return await axios.get(`${SERVER_URL}/get-creator-data`, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
};

const onPaymentSetup = async () => {
  return await axios.post(
    `${SERVER_URL}/stripe/authorize`,
    {},
    {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    }
  );
};

const onGetCreatorForCart = async (creator_id: string) => {
  return await axios.get(`${SERVER_URL}/get-creator-info-cart`, {
    headers: {
      "Content-Type": "application/json",
    },
    params: { creator_id },
    withCredentials: true,
  });
};

const onCheckOut = async (purchaseDetails: iPurchaseDetails) => {
  return await axios.post(
    `${SERVER_URL}/create-checkout-session`,
    purchaseDetails,
    {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    }
  );
};

export {
  onLogout,
  onLogin,
  onRegistration,
  onRequestVerificationAgain,
  onRefreshToken,
  onAddWish,
  onRemoveWish,
  onEditWish,
  onAddSocialLinks,
  onDeleteSocialLink,
  onVerifyEmail,
  onUpdateCreatorInfo,
  onIsUsernameAvailable,
  onGetCreatorInfo,
  onGetUserInfos,
  onGetCreatorData,
  onPaymentSetup,
  onGetCreatorForCart,
  onCheckOut,
  onSignUpWithGoogle,
};
