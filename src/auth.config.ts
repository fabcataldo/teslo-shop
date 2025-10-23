import NextAuth, { type NextAuthConfig }  from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import {z} from 'zod';
import { prisma } from './lib/prisma';
import bcryptjs from 'bcryptjs';
 
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/new-account'
  },
  callbacks: {
    jwt({token, user}) {
      if(user){
        token.data = user;
      }

      return token;
    },
    session({session, token}) {
      session.user = token.data as typeof session.user;
      return session
    },
    // authorized({ auth, request: { nextUrl } }) {
    authorized() {
      // const isLoggedIn = !!auth?.user;
      // const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      // if (isOnDashboard) {
      //   if (isLoggedIn) return true;
      //   return false; // Redirect unauthenticated users to login page
      // } else if (isLoggedIn) {
      //   return Response.redirect(new URL('/dashboard', nextUrl));
      // }
      return true;
    },
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if(!parsedCredentials.success) return null;

        //se ejecuta del lado del cliente, no del servidor    
        const { email, password } = parsedCredentials.data;

        //buscar el correo
        const user = await prisma.user.findUnique({where: { email  }});
        if(!user) return null;

        //comparar las contraseñas
        if(!bcryptjs.compareSync(password, user.password)) return null;

        //regresar el usuario sin el password
        const rest = {
          id: user.id,
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
          role: user.role,
          image: user.image
        };
        return rest;
      },
    }),
  ]
} 

export const { signIn, signOut, auth, handlers } = NextAuth(authConfig);