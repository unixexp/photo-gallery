import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: {  label: "Password", type: "password" }
            },
            authorize: async function (credentials, req) {
                try {
                    const res = await fetch("http://localhost:3000/api/login", {
                        method: "POST",
                        body: JSON.stringify(credentials),
                        headers: { "Content-Type": "application/json" }
                    })

                    const user = await res.json()

                    if (res.ok && user) {
                        return user
                    } else {
                        return null
                    }
                } catch (e) {
                    throw new Error(e)
                }
            }
        })
    ],
    secret: process.env.secret,
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            return true
        },
        async redirect({ url, baseUrl }) {
            return baseUrl
        },
        async session({ session, user, token }) {
            // console.log("session")
            return session
        },
        async jwt({ token, user }) {
            // console.log(token)
            // console.log(user)
            return token
        }
    }
}

export default NextAuth(authOptions);