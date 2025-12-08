'use server';

import { z } from 'zod';
import { pool } from '@/app/lib/db';
import { redirect } from 'next/navigation';
import { createSession } from '@/app/lib/session';

export type SignupState =
    | {
          errors?: {
              first_name?: string[];
              last_name?: string[];
              middle_name?: string[];
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
        middle_name: z.string().optional(),
        last_name: z.string().min(1, { message: 'Last name is required' }).trim(),
        contact_no: z
            .string()
            .regex(/^09\d{9}$/, { message: 'Contact number must be in format 09XXXXXXXXX' })
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

    const { first_name, middle_name, last_name, contact_no, username, password } = result.data;

    try {
        // Check if username already exists
        const [existingUsers] = await pool.query(
            'SELECT user_id FROM users WHERE username = ? OR contact_no = ?',
            [username, contact_no]
        );

        if (Array.isArray(existingUsers) && existingUsers.length > 0) {
            return {
                errors: {
                    general: ['Username or contact number already exists'],
                },
            };
        }

        // Hash the password (in production, use bcrypt or similar)
        // For now, storing plain text - THIS SHOULD BE CHANGED IN PRODUCTION
        const [insertResult] = await pool.query(
            'INSERT INTO users (first_name, middle_name, last_name, contact_no, username, password) VALUES (?, ?, ?, ?, ?, ?)',
            [first_name, middle_name || null, last_name, contact_no, username, password]
        );

        const userId = (insertResult as any).insertId;

        // Create session for the new user
        await createSession(String(userId));

        // Redirect to products page after successful signup
        redirect('/products');
    } catch (error) {
        console.error('Signup error:', error);
        return {
            errors: {
                general: ['An error occurred during signup. Please try again.'],
            },
        };
    }
}
