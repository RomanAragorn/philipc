'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { createSession } from '@/app/lib/session';
import { signUp } from '@/app/lib/queries/signUp';

export type SignupState =
    | {
          errors?: {
              first_name?: string[];
              last_name?: string[];
              email?: string[];
              contact_no?: string[];
              username?: string[];
              password?: string[];
              confirm_password?: string[];
              general?: string[];
          };
      }
    | undefined;

const signupSchema = z
    .object({
        first_name: z.string().min(1, { message: 'First name is required' }).trim(),
        last_name: z.string().min(1, { message: 'Last name is required' }).trim(),
        email: z.email({ message: 'Invalid email address' }).trim(),
        contact_no: z
            .string()
            .regex(/^9\d{9}$/, { message: 'Contact number must be in format 09XXXXXXXXX' })
            .trim(),
        username: z
            .string()
            .min(3, { message: 'Username must be at least 3 characters' })
            .max(150, { message: 'Username is too long' })
            .regex(/^[a-zA-Z0-9_]+$/, {
                message: 'Username can only contain letters, numbers, and underscores',
            })
            .trim(),
        password: z.string().min(8, { message: 'Password must be at least 8 characters' }).trim(),
        confirm_password: z.string().trim(),
    })
    .refine((data) => data.password === data.confirm_password, {
        message: 'Passwords do not match',
        path: ['confirm_password'],
    });

export async function signup(prevState: SignupState, formData: FormData): Promise<SignupState> {
    const result = signupSchema.safeParse(Object.fromEntries(formData));

    if (!result.success) {
        return {
            errors: result.error.flatten().fieldErrors,
        };
    }

    const { first_name, last_name, email, contact_no, username, password } = result.data;

    const signUpResult = await signUp(first_name, last_name, email, contact_no, username, password);

    if (!signUpResult.success) {
        return {
            errors: {
                general: [signUpResult.error || 'An error occurred during signup'],
            },
        };
    }

    await createSession(String(signUpResult.userId));

    redirect('/products');
}
