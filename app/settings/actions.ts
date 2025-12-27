'use server'

import { updateUser } from '@/app/lib/queries/user';

export async function update(formData: FormData) {
  const id = Number(formData.get('id'));
  const username = String(formData.get('username')) ?? null;
  const email = String(formData.get('email')) ?? null;
  const password = String(formData.get('password')) ?? null;

  await updateUser(id, username, email, password);
}