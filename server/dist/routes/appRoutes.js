"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const body_parser_1 = __importDefault(require("body-parser"));
// Controllers
const loginRegistrationRoutes_1 = require("../controllers/loginRegistrationRoutes");
const wishControllers_1 = require("../controllers/wishControllers");
const socialLinksController_1 = require("../controllers/socialLinksController");
const profileController_1 = require("../controllers/profileController");
const getUserController_1 = require("../controllers/getUserController");
const paymentController_1 = require("../controllers/paymentController");
const authValidation_1 = require("../validators/authValidation");
const refreshTokenController_1 = require("../controllers/refreshTokenController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const multer_1 = __importStar(require("multer"));
const router = (0, express_1.Router)();
const storage = (0, multer_1.memoryStorage)(); // store the file in memory as a buffer and then upload it to the S3 bucket
const upload = (0, multer_1.default)({ storage: storage });
upload.single('wish_image');
// User routes
router.get('/creator', getUserController_1.getCreator);
router.get('/get-creator-info-cart', getUserController_1.onGetCreatorInfoCart); // get creator info for the cart
router.get('/get-creator-data', authValidation_1.authenticateCreator, (0, authMiddleware_1.validate)(401), getUserController_1.onGetCreatorData); // get all the wishes of the creator
router.put('/update-user-profile', upload.fields([
    { name: 'profile_photo', maxCount: 1 }, { name: 'cover_photo', maxCount: 1 }
]), authValidation_1.authenticateCreator, (0, authMiddleware_1.validate)(401), profileController_1.onUpdateProfile);
// Authentication routes
router.post('/register', authValidation_1.registerValidation, (0, authMiddleware_1.validate)(409), loginRegistrationRoutes_1.userRegistration); // creator registration
router.get('/verify-email?:token', loginRegistrationRoutes_1.emailVerification); // verify creator email
router.post('/request-verification-again', loginRegistrationRoutes_1.reverifyEmail);
router.post('/login', authValidation_1.loginValidation, (0, authMiddleware_1.validate)(401), loginRegistrationRoutes_1.userLogin); // creator login
router.get('/logout', loginRegistrationRoutes_1.userLogout); // logout creator
router.get('/refresh-token', refreshTokenController_1.handleRefreshToken); // refresh token
// Profile routes
router.get('/check-username', (0, express_validator_1.check)('username').isString().trim().escape(), profileController_1.onCheckUsername); // get creator profile
router.post('/update-profile', upload.array('profile_images'), authValidation_1.authenticateCreator, (0, authMiddleware_1.validate)(401), profileController_1.onUpdateProfile);
router.get('/creator-infos', authValidation_1.authenticateCreator, (0, authMiddleware_1.validate)(401), profileController_1.onGetCreatorInfo); // get creator profile
router.post('/reset-password'); // reset password
// Wishes routes
router.post('/add-wish', upload.single('wish_image'), authValidation_1.authenticateCreator, (0, authMiddleware_1.validate)(401), wishControllers_1.onAddWish); // add wish
router.put('/update-wish', upload.single('wish_image'), authValidation_1.authenticateCreator, wishControllers_1.onUpdateWish); // update the wish
router.get('/delete-wish?:wish_id', authValidation_1.authenticateCreator, (0, authMiddleware_1.validate)(401), wishControllers_1.onDeleteWish); // delete the wish by the creator
// Social links routes
router.post('/add-social-links', authValidation_1.authenticateCreator, socialLinksController_1.onAddSocialLinks); // add social links at the creation of the profile
router.get('/delete-social-link?:link_id', authValidation_1.authenticateCreator, socialLinksController_1.onDeleteSocialLink); // delete social links
// PAYMENT ROUTES
router.post('/stripe/authorize', authValidation_1.authenticateCreator, paymentController_1.onPaymentSetup); // Stripe connect initial route
router.post('/stripe/reauth', authValidation_1.authenticateCreator, paymentController_1.onPaymentSetupRefresh); // Stripe connect initial route
router.get('/stripe/return?:creator_id', paymentController_1.onStripeReturn); // Stripe connect return route
router.post('/create-checkout-session', paymentController_1.onPurchase);
router.post('/payment-completed/webhook', body_parser_1.default.raw({ type: 'application/json' }), paymentController_1.onPaymentComplete); // Stripe webhook route;
exports.default = router;
