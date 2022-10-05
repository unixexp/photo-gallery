import { withAuth } from "next-auth/middleware";

export default withAuth({
    callbacks: {
        authorized({ req, token }) {
            if (token) return true;
        }
    }
})

export const config = {
    matcher: [
        "/api/admin/:path*"
    ]
}