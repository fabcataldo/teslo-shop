'use server';
 
import { signIn } from '@/auth.config';
import { sleep } from '@/utils';
import { AuthError } from 'next-auth';
 
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    // await sleep(2);

    //formdata es la data del form "encriptado"
    await signIn('credentials', formData);
  } catch (error) {
    // return 'Invalid credentials.';
    return 'CredentialsSignin';
  }
}