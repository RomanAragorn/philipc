'use server'

import { updateUser } from '@/app/lib/queries/user';

export type UpdateUserState = {
    success: boolean,
    error?: string
}

export async function update(prevState: UpdateUserState, formData: FormData): Promise<UpdateUserState> {
  const id = Number(formData.get('id'));
  const username = String(formData.get('username')) ?? null;
  const email = String(formData.get('email')) ?? null;
  const password = String(formData.get('password')) ?? null;
  const first_name = String(formData.get('first_name')) ?? null;
  const last_name = String(formData.get('last_name')) ?? null;
  const fb_link = String(formData.get('fb_link')) ?? null;
  const contact_no = String(formData.get('contact_no')) ?? null;
 
  return await updateUser(id, username, email, password, first_name, last_name, fb_link, contact_no);
}