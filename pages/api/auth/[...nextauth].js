import NextAuth from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import prisma from "@prisma/index"
import { compare } from "bcryptjs"

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Credentials',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: "Email", type: "text", placeholder: "email" },
        password: {  label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        //Connect to DB
        // const users = await client.db().collection('users');
        // //Find user with the email  
        // const result = await users.findOne({
        //     email: credentials.email,
        // });
        const user = await prisma.user.findUnique({where: {email: credentials.email}})
        //Not found - send error res
        if (!user) {
          return false;
        }
        //Check hashed password with DB password
        const checkPassword = await compare(credentials.password, user.password);
        if (!checkPassword) {
            return false;
        }
        //Else send success response
        return { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName };
          // You need to provide your own logic here that takes the credentials
          // submitted and returns either a object representing a user or value
          // that is false/null if the credentials are invalid.
          // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
          // You can also use the `req` object to obtain additional parameters
          // (i.e., the request IP address)
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 1 month expiry
    updateAge: 0, // Update JWT on each login
  },
  jwt: {
    secret: "supersecret",
  },
  pages: {
    signIn: "/login"
  },
  callbacks: {
    session: async ({session, token}) => {
      session.firstName = token.firstName;
      session.lastName = token.lastName;
      session.id = token.id;
      session.email = token.email
      return Promise.resolve(session);
    },
    jwt: async ({token, user}) => {
      if (user) {
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.email = user.email
        token.id = user.id
      }
      return Promise.resolve(token);
    },
  },
}

export default NextAuth(authOptions)