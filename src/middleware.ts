import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken"; // Import jwt for decoding tokens

const FRONTEND_URL = process.env.FRONTEND_URL;

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/pos/login") {
    return NextResponse.next();
  }

  if (!pathname.startsWith("/pos/")) {
    return NextResponse.next();
  }

  const token = req.cookies.get("accessToken")?.value;

  try {
    if (token !== undefined) {
      const decodedToken = jwt.decode(token);

      if (
        typeof decodedToken === "object" &&
        (decodedToken as JwtPayload).role === "ECOMUSER"
      ) {
        const loginUrl = new URL("/pos/login", FRONTEND_URL);
        return NextResponse.redirect(loginUrl);
      }
    }
  } catch (error) {
    const loginUrl = new URL("/pos/login", FRONTEND_URL);
    return NextResponse.redirect(loginUrl);
  }

  if (!token) {
    // Redirect to login page if no token is present
    const loginUrl = new URL("/pos/login", FRONTEND_URL);
    return NextResponse.redirect(loginUrl);
  }

  // Token exists, proceed to the next middleware or request handler
  return NextResponse.next();
}
