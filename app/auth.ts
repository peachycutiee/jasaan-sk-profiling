import NextAuth from "next-auth";
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [],
});

export { auth as middleware } from "./auth";
