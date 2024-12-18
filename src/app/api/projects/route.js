'use server'

import { NextResponse } from "next/server";
import ProjectModel from "@/models/project.model";
import { ConnectDb } from "@/database";

export async function GET() {
    ConnectDb()
    try {
        const projects = await ProjectModel.find().sort({ createdAt: -1 });
        return NextResponse.json({ projects });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        ConnectDb()
        const { title, description } = await req.json();

        if (!title || !description) {
            return res.status(400).json({ error: "Title and description are required" });
        }

        await ProjectModel.create({ title, description });
        return NextResponse.json({ message: "Successfull!!!" }, { status: 201 })
    }
    catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        const { id, status, assignedTo, score } = await req.json();

        const project = await ProjectModel.findById(id);

        if (!project) {
            return NextResponse.json({ error: "Project not found" });
        }

        // Update project details
        if (assignedTo) project.assignedTo = assignedTo;
        if (status) project.status = status;
        if (score) project.score = score;

        await project.save();

        return NextResponse.json({ message: "Project updated successfully", project });
    } catch (error) {
        res.status(500).json({ error: "Error updating project" });
    }
}