import crypto from 'crypto';

// This function will generate a random string of characters to be used as the verification token
const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};


export { generateVerificationToken };
