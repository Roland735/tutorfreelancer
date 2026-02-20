import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/post-job/:path*",
    "/admin/:path*",
    "/messages/:path*",
    "/settings/:path*",
  ],
};
