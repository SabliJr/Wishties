import { Router } from 'express';
import { check } from 'express-validator';
import bodyParser from 'body-parser';

// Controllers
import {
  userRegistration, userLogin, userLogout, emailVerification, reverifyEmail, onSignUpWithGoogle
} from '../controllers/loginRegistrationRoutes';
import { onAddWish, onDeleteWish, onUpdateWish } from '../controllers/wishControllers';
import { onAddSocialLinks, onDeleteSocialLink } from '../controllers/socialLinksController';
import { onUpdateProfile, onCheckUsername, onGetCreatorInfo } from '../controllers/profileController';
import { getCreator, onGetCreatorData, onGetCreatorInfoCart } from '../controllers/getUserController';
import {onPaymentSetup, onStripeReturn, onPaymentSetupRefresh, onPurchase, onPaymentComplete } from '../controllers/paymentController'

import { registerValidation, loginValidation, authenticateCreator } from '../validators/authValidation';
import  {handleRefreshToken} from '../controllers/refreshTokenController';
import { validate } from '../middlewares/authMiddleware';

import multer, {memoryStorage} from 'multer';

const router = Router();

const storage = memoryStorage(); // store the file in memory as a buffer and then upload it to the S3 bucket
const upload = multer({ storage: storage })
upload.single('wish_image');

// User routes
router.get('/creator', getCreator);
router.get('/get-creator-info-cart', onGetCreatorInfoCart) // get creator info for the cart
router.get('/get-creator-data', authenticateCreator, validate(401), onGetCreatorData) // get all the wishes of the creator
router.put('/update-user-profile', upload.fields([
  { name: 'profile_photo', maxCount: 1 }, { name: 'cover_photo', maxCount: 1 }]
), authenticateCreator, validate(401), onUpdateProfile);

// Authentication routes
router.post('/register', registerValidation, validate(409), userRegistration); // creator registration
router.get('/verify-email?:token', emailVerification) // verify creator email
router.post('/request-verification-again', reverifyEmail)
router.post('/login', loginValidation, validate(401), userLogin); // creator login
router.get('/logout', userLogout) // logout creator
router.get('/refresh-token', handleRefreshToken); // refresh token
router.get('/auth/google/callback', onSignUpWithGoogle); // google sign in

// Profile routes
router.get('/check-username', check('username').isString().trim().escape(), onCheckUsername) // get creator profile
router.post('/update-profile', upload.array('profile_images'), authenticateCreator, validate(401), onUpdateProfile)
router.get('/creator-infos', authenticateCreator, validate(401), onGetCreatorInfo) // get creator profile
router.post('/reset-password',) // reset password

// Wishes routes
router.post('/add-wish', upload.single('wish_image'), authenticateCreator, validate(401), onAddWish); // add wish
router.put('/update-wish', upload.single('wish_image'), authenticateCreator, onUpdateWish) // update the wish
router.get('/delete-wish?:wish_id', authenticateCreator, validate(401), onDeleteWish) // delete the wish by the creator

// Social links routes
router.post('/add-social-links', authenticateCreator, onAddSocialLinks) // add social links at the creation of the profile
router.get('/delete-social-link?:link_id', authenticateCreator, onDeleteSocialLink) // delete social links

// PAYMENT ROUTES
router.post('/stripe/authorize', authenticateCreator, onPaymentSetup) // Stripe connect initial route
router.post('/stripe/reauth', authenticateCreator, onPaymentSetupRefresh) // Stripe connect initial route
router.get('/stripe/return?:creator_id', onStripeReturn) // Stripe connect return route
router.post('/create-checkout-session', onPurchase);
router.post('/payment-completed/webhook', bodyParser.raw({type: 'application/json'}), onPaymentComplete) // Stripe webhook route;

export default router;