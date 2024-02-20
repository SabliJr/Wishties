"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const express_validator_1 = require("express-validator");
const validate = (statusCodes) => {
    return (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(statusCodes).json({
                errors: errors.array()
            });
        }
        next();
    };
};
exports.validate = validate;
