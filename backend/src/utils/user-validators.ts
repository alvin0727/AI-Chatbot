import { log } from "console";
import { Request, Response, NextFunction, } from "express";
import { body, ValidationChain, validationResult, query } from "express-validator";

const validate = (validations: ValidationChain[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        // Run all validations
        for (let validation of validations) {
            await validation.run(req);
        }

        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                status: "error",
                errors: errors.array()
            });
        }

        // If no errors, proceed to next middleware
        return next();
    };
}

const loginValidator = [
    body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email format"),
    body("password")
        .notEmpty()
        .withMessage("Password is required")
];

const signupValidator = [
    body("name")
        .notEmpty()
        .withMessage("Name is required"),
    ...loginValidator
];

const verifyEmailValidator = [
    query("token")
        .notEmpty()
        .withMessage("Token is required")
];

const resendVerificationValidator = [
    body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email format")
];

const verifyLoginOTPValidator = [
    body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email format"),
    body("otp")
        .notEmpty()
        .withMessage("OTP is required")
        .isNumeric()
        .withMessage("Invalid OTP format")
];

const resendLoginOTPValidator = [
    body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email format"),
];

export default {
    validate,
    loginValidator,
    signupValidator,
    verifyEmailValidator,
    resendVerificationValidator,
    verifyLoginOTPValidator,
    resendLoginOTPValidator
};