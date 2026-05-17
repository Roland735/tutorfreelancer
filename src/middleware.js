import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/profile-setup/:path*",
    "/jobs/:path*",
    "/post-job/:path*",
    "/applications/:path*",
    "/admin/:path*",
    "/messages/:path*",
    "/bookings/:path*",
    "/earnings/:path*",
    "/reviews/:path*",
    "/notifications/:path*",
    "/settings/:path*",
    "/help-support/:path*",
    "/wallet/:path*",
  ],
};
