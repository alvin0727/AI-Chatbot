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


const chatCompletionValidator = [
    body("message")
        .notEmpty()
        .withMessage("Message is required"),
];

export default {
    validate,
    chatCompletionValidator
}