import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/children/:path*",
    "/alerts/:path*",
    "/reports/:path*",
    "/settings/:path*",
    "/location/:path*",
    "/screen-time/:path*",
    "/devices/:path*",
  ],
};
