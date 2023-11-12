import { Router } from 'express';
import { getRoutes, userRegistration, userLogin, userLogout } from '../controllers/routesControllers';
import { registerValidation, loginValidation } from '../validators/authValidation';
import { validate } from '../middlewares/authMiddleware';
import { userAuth } from '../middlewares/validationMiddleware';

const router = Router();

router.get('/creators', getRoutes);
router.post('/register', registerValidation, validate, userRegistration); // creator registration
router.post('/login', loginValidation, validate, userLogin); // creator login
router.get('/logout', userAuth, userLogout) // logout creator
router.post('/add-wish', userAuth, ) // add wish to the wish list
router.post('/update-wish',) // update the wish by the creator
router.post('/delete-wish',) // delete the wish by the creator
router.post('/edit-profile',) // edit or update profile
router.post('/add-social-links',) // add social links at the creation of the profile
router.post('/edit-social-links',) // edit or update social links
router.post('/delete-social-links',) // delete social links

export default router;