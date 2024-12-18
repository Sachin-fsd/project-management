"use server"

import UserModel from "@/models/user.model";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ConnectDb } from "@/database";

export async function POST(req) {
    try {
        await ConnectDb()

        // Parse request body
        const { email, password } = await req.json();

        // Find the user by email
        const user = await UserModel.findOne({ email });
        if (!user) {
            return NextResponse.json({ msg: "Wrong credentials." }, { status: 401 });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ msg: "Wrong credentials." }, { status: 401 });
        }

        // User details
        const UserDetails = {
            UserID: user._id,
            UserName: user.name,
            UserEmail: user.email,
            UserRole: user.role,
        };

        // Generate JWT token
        const token = jwt.sign(
            { UserDetails },
            process.env.SECRET_KEY, // Ensure SECRET_KEY is defined in your environment variables
            { expiresIn: "7 days" }
        );

        // Set cookies (Note: Ensure you're using `next.config.js` for proper cookie handling)
        const response = NextResponse.json({ msg: "Login successful", UserDetails, ok: true });
        response.cookies.set("token", token, {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7,
        });
        response.cookies.set("UserDetails", JSON.stringify(UserDetails), {
            httpOnly: false,
            maxAge: 60 * 60 * 24 * 7,
        });

        return response;
    } catch (error) {
        console.error("Error in login:", error);
        return NextResponse.json({ err: "Something went wrong." }, { status: 500 });
    }
}
