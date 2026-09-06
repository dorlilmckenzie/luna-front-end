import { z } from 'zod';

/**
 * Client-side zod schemas. These mirror the backend validators but exist so the user
 * gets immediate feedback. The backend re-validates every request regardless.
 */

const strongPassword = z
  .string()
  .min(8, 'At least 8 characters')
  .regex(/[a-z]/, 'Add a lowercase letter')
  .regex(/[A-Z]/, 'Add an uppercase letter')
  .regex(/[0-9]/, 'Add a number');

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});
export type LoginValues = z.infer<typeof loginSchema>;

export const signupSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required').max(80),
    lastName: z.string().min(1, 'Last name is required').max(80),
    email: z.string().min(1, 'Email is required').email('Enter a valid email'),
    password: strongPassword,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    dateOfBirth: z
      .string()
      .min(1, 'Date of birth is required')
      .refine((v) => !Number.isNaN(Date.parse(v)), 'Enter a valid date')
      .refine((v) => new Date(v) < new Date(), 'Date of birth must be in the past')
      .refine((v) => {
        const age = (Date.now() - new Date(v).getTime()) / (365.25 * 864e5);
        return age >= 10 && age <= 100;
      }, 'Please enter a realistic date of birth'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
export type SignupValues = z.infer<typeof signupSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
});
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: strongPassword,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export const periodSchema = z
  .object({
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().optional(),
    flow: z.enum(['LIGHT', 'MEDIUM', 'HEAVY', 'VERY_HEAVY']),
    notes: z.string().max(2000).optional(),
  })
  .refine((d) => !d.endDate || new Date(d.endDate) >= new Date(d.startDate), {
    message: 'End date cannot be before the start date',
    path: ['endDate'],
  })
  .refine((d) => new Date(d.startDate) <= new Date(new Date().setHours(23, 59, 59)), {
    message: 'Start date cannot be in the future',
    path: ['startDate'],
  });
export type PeriodValues = z.infer<typeof periodSchema>;

export const symptomSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  types: z.array(z.string()).min(1, 'Select at least one symptom'),
  severity: z.enum(['MILD', 'MODERATE', 'SEVERE']),
  notes: z.string().max(2000).optional(),
});
export type SymptomValues = z.infer<typeof symptomSchema>;

export const moodSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  mood: z.enum(['HAPPY', 'CALM', 'ENERGETIC', 'NEUTRAL', 'SAD', 'IRRITATED', 'ANXIOUS', 'TIRED']),
  notes: z.string().max(2000).optional(),
});
export type MoodValues = z.infer<typeof moodSchema>;

export const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(80),
  lastName: z.string().min(1, 'Last name is required').max(80),
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
});
export type ProfileValues = z.infer<typeof profileSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Enter your current password'),
    newPassword: strongPassword,
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;
