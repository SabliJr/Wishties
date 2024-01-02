import axios from "axios";
import {
  registrationInfo,
  loginInfo,
  iCreatorSocialLinks,
} from "../Types/creatorSocialLinksTypes";

const SERVER_URL = "http://localhost:8000/api";

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

const onGetCreator = async () => {
  return await axios.get(`${SERVER_URL}/get-creator`, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
};

const onAddWish = async (FormData: FormData) => {
  return await axios.post(`${SERVER_URL}/add-wish`, FormData, {
    withCredentials: true,
  });
};

const onRemoveWish = async () => {
  return await axios.get(`${SERVER_URL}/remove-wish`, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
};

const onEditWish = async () => {
  return await axios.get(`${SERVER_URL}/edit-wish`, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
};

const onGetWish = async () => {
  return await axios.get(`${SERVER_URL}/get-wish`, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
};

const onGetWishes = async () => {
  return await axios.get(`${SERVER_URL}/get-wishes`, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
};

const onGetWishesByCategory = async () => {
  return await axios.get(`${SERVER_URL}/get-wishes-by-category`, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
};

const onGetWishesByPrice = async () => {
  return await axios.get(`${SERVER_URL}/get-wishes-by-price`, {
    headers: {
      "Content-Type": "application/json",
    },
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

const onEditSocialLinks = async () => {
  return await axios.get(`${SERVER_URL}/edit-social-links`, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
};

const onGetSocialLinks = async () => {
  return await axios.get(`${SERVER_URL}/get-social-links`, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
};

const onUpdateCreatorInfo = async (formData: FormData) => {
  return await axios.post(`${SERVER_URL}/update-profile`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
};

export {
  onGetCreator,
  onLogout,
  onLogin,
  onRegistration,
  onRequestVerificationAgain,
  onRefreshToken,
  onAddWish,
  onRemoveWish,
  onEditWish,
  onGetWish,
  onGetWishes,
  onGetWishesByCategory,
  onGetWishesByPrice,
  onAddSocialLinks,
  onEditSocialLinks,
  onGetSocialLinks,
  onVerifyEmail,
  onUpdateCreatorInfo,
};
