import { Router } from 'express';
import { userRegistration, userLogin, userLogout, emailVerification, reverifyEmail } from '../controllers/loginRegistrationRoutes';
import { onAddWish } from '../controllers/wishControllers';
import { registerValidation, loginValidation } from '../validators/authValidation';
import { getCreators } from '../controllers/getUserController';
import  {handleRefreshToken} from '../controllers/refreshTokenController';
import { validate } from '../middlewares/authMiddleware';
import { userAuth } from '../middlewares/validationMiddleware';
import multer, {memoryStorage} from 'multer';

const router = Router();

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, '../uploads/');
//   },
//   filename: function (req, file, cb) {
//     cb(null, new Date().toISOString() + file.originalname);
//   },
// });

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
//router.post('/reset-password',) // reset password
router.post('/add-wish', upload.single('wish_image'), onAddWish); // add wish to the wish list
//router.post('/update-wish',) // update the wish by the creator
//router.post('/delete-wish',) // delete the wish by the creator
//router.post('/edit-profile',) // edit or update profile
//router.post('/add-social-links',) // add social links at the creation of the profile
//router.post('/edit-social-links',) // edit or update social links
//router.post('/delete-social-links',) // delete social links

export default router;