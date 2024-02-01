import jwt from 'jsonwebtoken';
import { REFRESH_TOKEN_SECRET, EMAIL_HOST, CLIENT_URL } from '../constants';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

const generateVerificationToken = (username: string, creator_id: string) => {
  // Generate a hash of the username
  const uuid = uuidv4() as string;
  const hash = crypto.createHash('sha256')
    .update(uuid)
    .digest('hex')
    .substring(0, 10);

  // Use the hash as a unique identifier in the token
  const token = jwt.sign({ hash, username, creator_id }, REFRESH_TOKEN_SECRET as string, { expiresIn: '1h' }); // Set to 1 hour
  return token;
};

const sendVerificationEmail = (email: string, token: string) => { 
  // Send a verification email
  const mailOptions = {
    from: `Wishties 🎁` + EMAIL_HOST,
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
            <a  href="${CLIENT_URL}/verify-email/${token}" 
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

const isValidAuthToken = (authToken: string) => {
  try {
    jwt.verify(authToken, REFRESH_TOKEN_SECRET as string);
    return true;
  } catch (error) {
    return false;
  }
}
 

export { generateVerificationToken, sendVerificationEmail, isValidAuthToken };
