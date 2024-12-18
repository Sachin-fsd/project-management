"use server";

import { NextResponse } from "next/server";
import { jwtVerify } from "jose"; // Use `jose` for JWT verification

export default async function middleware(req) {
    const { pathname } = req.nextUrl;

    // Exclude `/welcome` and static files
    if (pathname === "/") {
        console.log("Middleware start:", pathname);

        try {
            // Get the token from cookies or Authorization header
            const token = req.cookies.get("token")?.value || req.headers.get("authorization")?.split(" ")[1] || "";

            if (!token) {
                console.log("No token provided, redirecting to /welcome");
                return NextResponse.redirect(new URL("/welcome", req.url));
            }

            // Verify the token using `jose` instead of `jsonwebtoken`
            try {
                const secretKey = new TextEncoder().encode(process.env.SECRET_KEY); // Convert to Uint8Array
                const { payload } = await jwtVerify(token, secretKey);
                if (!payload) {
                    console.log("Token verification failed!, redirecting to /welcome");
                    return NextResponse.redirect(new URL("/welcome", req.url));
                }

                // Pass user details to headers for downstream access
                req.headers.set("user", JSON.stringify(payload.UserDetails));
                console.log("Middleware end:", pathname);
                return NextResponse.next();
            } catch (err) {
                console.log("Token verification failed, redirecting to /welcome", err);
                return NextResponse.redirect(new URL("/welcome", req.url));
            }
        } catch (error) {
            console.error("Middleware error:", error);
            return NextResponse.redirect(new URL("/welcome", req.url));
        }
    } else {
        return NextResponse.next();
    }
}

// export const config = {
//     matcher: [
//         "/((?!_next/static|favicon.ico|welcome|auth).*)", // Exclude static files and `/welcome`
//     ],
// };
