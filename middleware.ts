// export { default } from "next-auth/middleware";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { UserType } from "./lib/interfaces/user.interface";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const { token } = req.nextauth;

    const user = token?.user as UserType;
    const returnURL = `${process.env.NEXTAUTH_URL}/dashboard`;

    if (pathname.startsWith("/transactions") && user.role === "user") {
      return NextResponse.redirect(returnURL);
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        console.log("tokenmiddle", token);
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/settings/:path*", "/transactions/:path*"],
};
