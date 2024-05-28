import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export default authMiddleware({
  publicRoutes: ["/", "/sign-in", "sign-up"],
  beforeAuth(req) {
    return rewrites(req);
  },
  afterAuth(auth, req) {
    const subdomain = getSubdomain(req);
    if (!auth.userId && subdomain === "app") {
      return redirectToSignIn({
        returnBackUrl: req.url.replace("localhost", "app.localhost"),
      });
    } else {
      return NextResponse.next();
    }
  },
});

function getSubdomain(req: NextRequest) {
  const hostname = req.headers.get("host") ?? req.nextUrl.host;
  const subdomain = hostname
    .replace("http://", "")
    .replace("https://", "")
    .replace("localhost:3000", "")
    .replace("process.env.NEXT_PUBLIC_ROOT_DOMAIN", "")
    .replace(".", "");

  if (subdomain == "") {
    return null;
  }
  return subdomain;
}

function rewrites(req: NextRequest) {
  const { nextUrl: url } = req;
  const path = url.pathname;
  const subdomain = getSubdomain(req);
  const hostname = req.headers.get("host") ?? req.nextUrl.host;

  console.log(hostname, url, "HOSTNAME");

  if (subdomain == "app") {
    return NextResponse.rewrite(
      new URL(`/app${path === "/" ? "" : path}`, req.url)
    );
  }
  if (
    hostname === "localhost:3000" ||
    hostname === process.env.NEXT_PUBLIC_PROD_HOSTNAME
  ) {
    return NextResponse.rewrite(new URL(`${path}`, req.url));
  }
  return NextResponse.rewrite(new URL(`/${hostname}${path}`, req.url));
}

export const config = { matcher: ["/((?!...|_next).)", "/", "/(api|trpc)(.)"] };
