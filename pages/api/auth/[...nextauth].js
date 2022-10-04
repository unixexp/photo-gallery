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
            async authorize(credentials, req) {
                const res = await fetch("http://localhost:3000/api/login", {
                    method: "POST",
                    body: JSON.stringify(credentials),
                    headers: { "Content-Type": "application/json" }
                })

                const user = await res.json()

                if (res.ok && user) {
                    console.log(user)
                    return user
                } else {
                    return null
                }
            }
        })
    ],
    secret: "ldb+owSLLcGVfirUl/T6FASBzIuKnyp/l4ogQtrXOFM=",
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
        updateAge: 24 * 60 * 60, // 24 hours
        generateSessionToken: () => {
          return randomUUID?.() ?? randomBytes(32).toString("hex")
        }
      },
      jwt: {
        maxAge: 60 * 60 * 24 * 30
      }
}

export default NextAuth(authOptions);