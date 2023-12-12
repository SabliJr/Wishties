import { Router } from 'express';
import { userRegistration, userLogin, userLogout, emailVerification, reverifyEmail } from '../controllers/loginRegistrationRoutes';
import { registerValidation, loginValidation } from '../validators/authValidation';
import { getCreators } from '../controllers/getUserController';
import { validate } from '../middlewares/authMiddleware';
import { userAuth } from '../middlewares/validationMiddleware';

const router = Router();

router.get('/creators', getCreators);
router.post('/register', registerValidation, validate(409), userRegistration); // creator registration
router.get('/verify-email/:token', emailVerification) // verify creator email
router.post('/request-verification-again', reverifyEmail)
router.post('/login', loginValidation, validate(401), userLogin); // creator login
router.get('/logout', userLogout) // logout creator
// router.post('/add-wish', userAuth, ) // add wish to the wish list
//router.post('/update-wish',) // update the wish by the creator
//router.post('/delete-wish',) // delete the wish by the creator
//router.post('/edit-profile',) // edit or update profile
//router.post('/add-social-links',) // add social links at the creation of the profile
//router.post('/edit-social-links',) // edit or update social links
//router.post('/delete-social-links',) // delete social links

export default router;