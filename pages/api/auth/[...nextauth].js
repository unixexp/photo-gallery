import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions = {

    session: {
        strategy: "jwt"
    },
    
    providers: [
        CredentialsProvider({
            type: "credentials",
            authorize: async function (credentials, req) {
                const { login, password } = credentials
                // TODO: make request to api to authorize
                if (login !== "admin" || password != "pass") {
                    return null
                } else {
                    return {id: "1234", name: "Administrator"}
                }
            }
        })
    ],

    pages: {
        signIn: "/auth/signin"
    }

    /*
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
    */
}

export default NextAuth(authOptions);