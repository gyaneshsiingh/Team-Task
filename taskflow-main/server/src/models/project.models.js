import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "member"],
    default: "member",
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
});

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
      maxlength: [60, "Project name cannot exceed 60 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
      default: "",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Project owner is required"],
    },
    members: [memberSchema],
    color: {
      type: String,
      match: [/^#[0-9A-Fa-f]{6}$/, "Color must be a valid hex color"],
      default: "#3b82f6",
    },
    status: {
      type: String,
      enum: ["active", "archived"],
      default: "active",
    },
  },
  { timestamps: true }
);

// Ensure owner is always in the members list as admin
projectSchema.pre("save", function (next) {
  const ownerInMembers = this.members.some(
    (m) => m.user.toString() === this.owner.toString()
  );
  if (!ownerInMembers) {
    this.members.push({ user: this.owner, role: "admin" });
  }
  next();
});

projectSchema.index({ owner: 1 });
projectSchema.index({ "members.user": 1 });

const Project = mongoose.model("Project", projectSchema);
export default Project;
