import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    score: { type: Number },
    status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" },
}, { timestamps: true });

export default mongoose.models.Project || mongoose.model("Project", ProjectSchema);
