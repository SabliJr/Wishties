"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidAuthToken = exports.sendVerificationEmail = exports.generateVerificationToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_1 = require("../constants");
const crypto_1 = __importDefault(require("crypto"));
const uuid_1 = require("uuid");
const generateVerificationToken = (username, creator_id) => {
    // Generate a hash of the username
    const uuid = (0, uuid_1.v4)();
    const hash = crypto_1.default.createHash('sha256')
        .update(uuid)
        .digest('hex')
        .substring(0, 10);
    // Use the hash as a unique identifier in the token
    const token = jsonwebtoken_1.default.sign({ hash, username, creator_id }, constants_1.REFRESH_TOKEN_SECRET, { expiresIn: '1h' }); // Set to 1 hour
    return token;
};
exports.generateVerificationToken = generateVerificationToken;
const sendVerificationEmail = (email, token) => {
    // Send a verification email
    const mailOptions = {
        from: `Wishties 🎁` + constants_1.EMAIL_HOST,
        to: email,
        subject: 'Email Verification',
        html: `
      <html>
        <head>
            <title>Verify Your Email</title>  
            <style type="text/css">
              {{!-- your css goes here --}}
            </style>
        </head>
        <body>

            <h2 style="font-family: Arial, sans-serif; color: #1D3557;">
              Thanks for creating a Wishties account.
            </h2>

            <p style="
              font-family: Arial, sans-serif;
              font-size: 1rem;">
              Verify your email address by clicking this button below so that you can get up and running quickly.
            </p>
          <div>
            <a  href="${constants_1.CLIENT_URL}/verify-email/${token}" 
              style="
                background-color: #1D3557;
                color: #FBFFFE;
                border: none;
                border-radius: .6rem;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                text-decoration: none;
                text-align: center;
                padding: .8rem 1rem;
                margin: .5rem 0;
                letter-spacing: .6px;">
                Verify Email
            </a>
          </div>

          <div style="
           margin: 2rem 0;
          ">
            <hr/>
          </div>
        </body>
      </html>
    `,
    };
    return mailOptions;
};
exports.sendVerificationEmail = sendVerificationEmail;
const isValidAuthToken = (authToken) => {
    try {
        jsonwebtoken_1.default.verify(authToken, constants_1.REFRESH_TOKEN_SECRET);
        return true;
    }
    catch (error) {
        return false;
    }
};
exports.isValidAuthToken = isValidAuthToken;
