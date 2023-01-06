import { withAuth } from "next-auth/middleware";

export default withAuth(
    function middleware(req) {
        console.log(`${req.url} - ${req.method}`)
    },
    {
        callbacks: {
            authorized({ token }) {
                return token?.role === "admin"
            }
        }
    }
)

export const config = {
    matcher: [
        "/admin/:path*",
        "/api/admin/:path*"
    ]
}