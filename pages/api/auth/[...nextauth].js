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
                    throw new Error("Invalid credentials")
                } else {
                    return {
                        id: "1234",
                        name: "Administrator",
                        role: "admin"
                    }
                }
            }
        })
    ],

    callbacks: {
        async jwt(params) {
            if (params.user?.role) {
                params.token.role = params.user.role
            }

            return params.token
        }
    },

    pages: {
        signIn: "/auth/signin"
    }
}

export default NextAuth(authOptions);