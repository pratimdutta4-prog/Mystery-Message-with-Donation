import { z } from 'zod';

export const usernameValidation = z
    .string()
    .min(3, 'Username must contain at least 3 characters.')
    .max(20, 'Username must contain at most 20 characters.')
    .regex(/^[a-zA-Z0-9_.-]*$/, 'Username must not contain any special characters except `_`.');

const emailValidation = z
    .string()
    .email({ message: 'Invalid email.' });

const phoneValidation = z
.string()
.length(10, 'Phone no. must be 10 digits.')
.regex(/^\d{10}$/, 'Enter a valid phone number.');

const passwordValidation = z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long.' });

export const signUpSchema = z.object({
    username: usernameValidation,
    email: emailValidation,
    phone: phoneValidation,
    password: passwordValidation
});