import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Todo title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required for the todo"],
      minlength: [10, "Description must be greater than 10 characters"],
      maxlength: [500, "Description cannot exceed 500 characters"],
      default: "",
    },
    status: {
      type: String,
      enum: ["todo", "in-progress", "done"],
      default: "todo",
    },
    completed: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    category: {
      type: String,
      trim: true,
      maxlength: [30, "Category cannot exceed 30 characters"],
      default: "general",
    },
    dueDate: {
      type: Date,
      validate: {
        validator: function (value) {
          if (!value) return true;
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const due = new Date(value);
          due.setHours(0, 0, 0, 0);
          return due >= today;
        },
        message: "Due date must be today or in the future",
      },
    },
    // Personal task owner (for solo tasks)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    // Project this task belongs to (optional - null means personal task)
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null,
    },
    // Who is assigned to this task (can differ from creator)
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    tags: [
      {
        type: String,
        trim: true,
        maxlength: [20, "Tag cannot exceed 20 characters"],
      },
    ],
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Sync completed <-> status
todoSchema.pre("save", function (next) {
  if (this.isModified("status")) {
    this.completed = this.status === "done";
  } else if (this.isModified("completed")) {
    this.status = this.completed ? "done" : "todo";
  }
  next();
});

todoSchema.index({ userId: 1, completed: 1 });
todoSchema.index({ userId: 1, category: 1 });
todoSchema.index({ userId: 1, priority: 1 });
todoSchema.index({ userId: 1, createdAt: -1 });
todoSchema.index({ projectId: 1 });
todoSchema.index({ assignedTo: 1 });

todoSchema.virtual("isOverdue").get(function () {
  if (!this.dueDate || this.completed) return false;
  return new Date() > this.dueDate;
});

todoSchema.set("toJSON", { virtuals: true });

const Todo = mongoose.model("Todo", todoSchema);
export default Todo;