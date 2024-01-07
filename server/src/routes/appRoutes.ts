import { Router } from 'express';

// Controllers
import { userRegistration, userLogin, userLogout, emailVerification, reverifyEmail } from '../controllers/loginRegistrationRoutes';
import { onAddWish, onGetWishes, onDeleteWish } from '../controllers/wishControllers';
import { onAddSocialLinks, onGetSocialLinks, onDeleteSocialLink } from '../controllers/socialLinksController';
import { onProfileUpdate } from '../controllers/profileController';

import { registerValidation, loginValidation, authenticateCreator } from '../validators/authValidation';
import { getCreators } from '../controllers/getUserController';
import  {handleRefreshToken} from '../controllers/refreshTokenController';
import { validate } from '../middlewares/authMiddleware';

import { userAuth } from '../middlewares/validationMiddleware';
import multer, {memoryStorage} from 'multer';

const router = Router();

const storage = memoryStorage(); // store the file in memory as a buffer and then upload it to the S3 bucket
const upload = multer({ storage: storage })
upload.single('wish_image');
console.log(upload.single('wish_image'));

router.get('/creators', getCreators);
router.post('/register', registerValidation, validate(409), userRegistration); // creator registration
router.get('/verify-email?:token', emailVerification) // verify creator email
router.post('/request-verification-again', reverifyEmail)
router.post('/login', loginValidation, validate(401), userLogin); // creator login
router.get('/logout', userLogout) // logout creator
router.get('/refresh-token', handleRefreshToken); // refresh token
router.post('/update-profile', upload.array('profile_images'), authenticateCreator, validate(401), onProfileUpdate) 

// Wishes routes
router.post('/add-wish', upload.single('wish_image'), authenticateCreator, validate(401), onAddWish); // add wish
router.get('/get-wishes', authenticateCreator, validate(401), onGetWishes); // get all wishes
router.post('/add-social-links', authenticateCreator, onAddSocialLinks) // add social links at the creation of the profile
router.post('/update-wish',) // update the wish by the creator
router.get('/delete-wish?:wish_id', authenticateCreator, validate(401), onDeleteWish) // delete the wish by the creator

// Social links routes
router.get('/get-social-links', authenticateCreator, onGetSocialLinks) // get social links 
router.get('/delete-social-links?:link_id', authenticateCreator, onDeleteSocialLink) // delete social links
//router.post('/reset-password',) // reset password

export default router;