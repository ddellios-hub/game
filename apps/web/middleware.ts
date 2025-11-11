export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/lobby/:path*", "/rooms/:path*", "/creator", "/shop", "/reports", "/admin"]
};
