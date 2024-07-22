import { NextResponse } from "next/server";

export function middleware(request) {
  const path = request.nextUrl.pathname;
  const isPublicPath = path === "/blogs" || path === "/blogs";

  const token = request.cookies.get("token")?.value || "";
  const isValidToken = verifyToken(token);

  // Check if the path is dynamic (e.g., /profile/:id)
  const isDynamicPath = /^\/profile\/[a-zA-Z0-9]+$/.test(path);
  //  const isDynamicPath = /^\/profile\/.+$/i.test(path);

  if (isDynamicPath && !isValidToken) {
    return NextResponse.redirect(new URL("/blogs", request.nextUrl));
  }

  if (isDynamicPath && isValidToken) {
    return NextResponse.next();
  }

  if (!token && path.startsWith("/profile/")) {
    return NextResponse.redirect(new URL("/blogs", request.nextUrl));
  }

  if (!token && isDynamicPath) {
    return NextResponse.redirect(new URL("/blogs", request.nextUrl));
  }

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/blogs", request.nextUrl));
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/blogs", request.nextUrl));
  }

  if (path === "/" && token) {
    return NextResponse.redirect(new URL("/blogs", request.nextUrl));
  }

  if (path === "/blogs/create" && token) {
    return NextResponse.redirect(new URL("/blogs/create", request.nextUrl));
  }

  if (path === "/" && !token) {
    return NextResponse.redirect(new URL("/blogs", request.nextUrl));
  }
}

// Add a function to verify the token
function verifyToken(token) {
  return true;
}

// See "Matching Paths" below to learn more
export const config = {
  // matcher: ["/", "/blogs", "/profile/:id*"],
  matcher: ["/", "/blogs"],
};
