"use server"

import UserModel from "@/models/user.model";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { ConnectDb } from "@/database";

export async function POST(req) {
    try {
        await ConnectDb()

        // Parse request body
        const { name, email, password, role } = await req.json();

        // Check if the user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { msg: "User already exists." },
                { status: 400 }
            );
        }

        // Hash the password
        const salt = bcrypt.genSaltSync(10); // Use a higher cost factor for better security
        const hashedPassword = bcrypt.hashSync(password, salt);

        // Create the user
        await UserModel.create({ name, email, password: hashedPassword, role });

        return NextResponse.json(
            { msg: "Successfully created account", ok: true },
            { status: 200 }
        );
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { msg: "Something went wrong", ok: false },
            { status: 500 }
        );
    }
}
