'use server';

import { z } from 'zod';
import { createSession, deleteSession } from '@/app/lib/session';
import { redirect } from 'next/navigation';
import { verifyUser } from '@/app/lib/queries/verifyUser';

export type LoginState =
    | {
          errors?: {
              username?: string[];
              password?: string[];
          };
      }
    | undefined;

const loginSchema = z.object({
    username: z.string().min(1, { message: 'Username or email is required' }).trim(),
    password: z.string().min(3, { message: 'Password must be at least 3 characters' }).trim(),
});

export async function login(prevState: LoginState, formData: FormData): Promise<LoginState> {
    const result = loginSchema.safeParse(Object.fromEntries(formData));

    if (!result.success) {
        return {
            errors: result.error.flatten().fieldErrors,
        };
    }

    const { username, password } = result.data;

    const fetchedUser = await verifyUser(username, password);

    if (!fetchedUser.data) {
        return {
            errors: {
                username: ['Invalid username/email or password'],
            },
        };
    }

    await createSession(String(fetchedUser.data.user_id));
    redirect('/');
}

export async function logout(): Promise<never> {
    await deleteSession();
    redirect('/');
}
