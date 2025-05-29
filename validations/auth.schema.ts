import { z } from "zod";

import { passwordRegex, nicknameRegex } from "@/validations/regex/auth.regex";

export const passwordSchema = z
  .string({ required_error: "Password is required" })
  .min(8, { message: "Password must be at least 8 characters long" })
  .max(16, { message: "Password must be less than 16 characters" })
  .regex(
    passwordRegex,
    "Password must contain at least one letter and one number"
  );

export const signInSchema = z.object({
  email: z.string({ required_error: "Email is required" }).email(),
  password: passwordSchema,
});

export type SignInType = z.infer<typeof signInSchema>;

const baseSignUpObjectSchema = z.object({
  email: z.string({ required_error: "Email is required" }).email(),
  password: passwordSchema,
  confirmPassword: passwordSchema,
  nickname: z
    .string({ required_error: "Nickname is required" })
    .min(3, {
      message: "Nickname must be at least 3 characters long",
    })
    .max(8, {
      message: "Nickname must be less than 8 characters",
    })
    .regex(nicknameRegex, {
      message: "Nickname must contain only letters, numbers, and underscores",
    }),
});

export const signUpSchema = baseSignUpObjectSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  }
);

export type SignUpType = z.infer<typeof signUpSchema>;

export const socialSignUpSchema = baseSignUpObjectSchema.pick({
  email: true,
});

export type SocialSignUpType = z.infer<typeof socialSignUpSchema>;

export const forgotPasswordSchema = signInSchema.pick({
  email: true,
});

export type ForgotPasswordType = z.infer<typeof forgotPasswordSchema>;

export const verifyCodeSchema = forgotPasswordSchema.extend({
  code: z.coerce
    .number({ required_error: "Code is required" })
    .min(100000, { message: "Code must be 6 digits" })
    .max(999999, { message: "Code must be 6 digits" }),
});

export type VerifyCodeType = z.infer<typeof verifyCodeSchema>;

export const resetPasswordSchema = z
  .object({
    email: z.string({ required_error: "Email is required" }).email(),
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordType = z.infer<typeof resetPasswordSchema>;
