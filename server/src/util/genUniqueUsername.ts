import { query } from '../db';

const generateUniqueUsername = async (creator_name: string) => {
  const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

  let username = creator_name.replace(/\s+/g, ''); // Remove spaces from the user's name
  username += getRandomInt(1000, 9999); // Add random integers

  // Append additional characters (underscore, dash, dots)
  const additionalCharacters = ['_', '-', '.'];
  username += additionalCharacters[Math.floor(Math.random() * additionalCharacters.length)];

  // Check for uniqueness
while (await isUsernameTaken(username)) {
  username = username + getRandomInt(1000, 9999) + additionalCharacters[Math.floor(Math.random() * additionalCharacters.length)];
}

  return username;
};

// THis function to check if the username is already taken in the database
const isUsernameTaken = async (username: string) => {
  try {
    const result = await query('SELECT * FROM creator WHERE creator_name = $1', [username]);
    if (result.rows.length > 0) {
      // Username is taken
      return true;
    }

    // Username is not taken
    return false;
  } catch (error) {
    console.error('Error checking username availability:', error);
    // Handle the error appropriately, e.g., log it or throw a specific error
    throw new Error('Error checking username availability');
  }
};

export { generateUniqueUsername };
