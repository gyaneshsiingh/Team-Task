import Todo from "../models/todo.models.js";
import Project from "../models/project.models.js";

// Helper: Verify user can access a project
async function verifyProjectAccess(projectId, userId) {
  if (!projectId) return true;
  const project = await Project.findOne({
    _id: projectId,
    $or: [{ owner: userId }, { "members.user": userId }],
  });
  return !!project;
}

// ─── Get All Todos ──────────────────────────────────────────────────────────
export const getTodos = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      completed,
      priority,
      category,
      search,
      projectId,
      status,
    } = req.query;

    // Base filter: non-archived tasks
    let filter = { isArchived: false };

    // Visibility: project tasks vs personal/assigned tasks
    const visibilityCondition = projectId
      ? { projectId }
      : {
          $or: [
            { userId: req.user.id, projectId: null },
            { assignedTo: req.user.id, projectId: null },
          ],
        };

    if (projectId) {
      // Fetch project tasks — check membership
      const hasAccess = await verifyProjectAccess(projectId, req.user.id);
      if (!hasAccess) {
        return res
          .status(403)
          .json({ success: false, message: "Access denied to this project" });
      }
    }

    if (completed !== undefined) filter.completed = completed === "true";
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;

    // Combine visibility with optional search using $and to avoid $or conflicts
    const andClauses = [visibilityCondition];
    if (search) {
      andClauses.push({
        $or: [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],
      });
    }
    filter.$and = andClauses;


    const todos = await Todo.find(filter)
      .populate("assignedTo", "name email")
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Todo.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        todos,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
        },
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ─── Get Single Todo ─────────────────────────────────────────────────────────
export const getTodo = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id)
      .populate("assignedTo", "name email")
      .populate("userId", "name email");

    if (!todo) {
      return res
        .status(404)
        .json({ success: false, message: "Todo not found" });
    }

    // Personal task check
    if (!todo.projectId && todo.userId._id.toString() !== req.user.id.toString()) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    // Project task check
    if (todo.projectId) {
      const hasAccess = await verifyProjectAccess(todo.projectId, req.user.id);
      if (!hasAccess) {
        return res.status(403).json({ success: false, message: "Access denied" });
      }
    }

    res.status(200).json({ success: true, data: { todo } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ─── Create Todo ─────────────────────────────────────────────────────────────
export const createTodo = async (req, res) => {
  try {
    const { projectId, assignedTo, ...rest } = req.body;

    if (projectId) {
      const hasAccess = await verifyProjectAccess(projectId, req.user.id);
      if (!hasAccess) {
        return res
          .status(403)
          .json({ success: false, message: "Access denied to this project" });
      }
    }

    const todoData = {
      ...rest,
      userId: req.user.id,
      projectId: projectId || null,
      assignedTo: assignedTo || req.user.id,
    };

    const todo = await Todo.create(todoData);
    const populated = await todo.populate([
      { path: "assignedTo", select: "name email" },
      { path: "userId", select: "name email" },
    ]);

    res.status(201).json({
      success: true,
      message: "Todo created successfully",
      data: { todo: populated },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ─── Update Todo ─────────────────────────────────────────────────────────────
export const updateTodo = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res
        .status(404)
        .json({ success: false, message: "Todo not found" });
    }

    // Check permission
    if (todo.projectId) {
      const hasAccess = await verifyProjectAccess(todo.projectId, req.user.id);
      if (!hasAccess) {
        return res.status(403).json({ success: false, message: "Access denied" });
      }
    } else if (todo.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    // Apply updates
    const allowedFields = [
      "title", "description", "dueDate", "priority", "category",
      "status", "completed", "assignedTo", "tags", "isArchived",
    ];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) todo[field] = req.body[field];
    });

    await todo.save();
    const populated = await todo.populate([
      { path: "assignedTo", select: "name email" },
      { path: "userId", select: "name email" },
    ]);

    res.status(200).json({
      success: true,
      message: "Todo updated successfully",
      data: { todo: populated },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ─── Delete Todo ─────────────────────────────────────────────────────────────
export const deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res
        .status(404)
        .json({ success: false, message: "Todo not found" });
    }

    if (todo.projectId) {
      const hasAccess = await verifyProjectAccess(todo.projectId, req.user.id);
      if (!hasAccess) {
        return res.status(403).json({ success: false, message: "Access denied" });
      }
    } else if (todo.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    await Todo.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Todo deleted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ─── Toggle Todo Completion ──────────────────────────────────────────────────
export const toggleTodo = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res
        .status(404)
        .json({ success: false, message: "Todo not found" });
    }

    if (todo.projectId) {
      const hasAccess = await verifyProjectAccess(todo.projectId, req.user.id);
      if (!hasAccess) {
        return res.status(403).json({ success: false, message: "Access denied" });
      }
    } else {
      const isOwner = todo.userId.toString() === req.user.id.toString();
      const isAssignee = todo.assignedTo && todo.assignedTo.toString() === req.user.id.toString();
      if (!isOwner && !isAssignee) {
        return res.status(403).json({ success: false, message: "Access denied" });
      }
    }

    todo.completed = !todo.completed;
    todo.status = todo.completed ? "done" : "todo";
    await todo.save();

    const populated = await todo.populate([
      { path: "assignedTo", select: "name email" },
      { path: "userId", select: "name email" },
    ]);

    res.status(200).json({
      success: true,
      message: "Todo status updated successfully",
      data: { todo: populated },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ─── Update Task Status ───────────────────────────────────────────────────────
export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["todo", "in-progress", "done"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status value" });
    }

    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res
        .status(404)
        .json({ success: false, message: "Todo not found" });
    }

    if (todo.projectId) {
      const hasAccess = await verifyProjectAccess(todo.projectId, req.user.id);
      if (!hasAccess) {
        return res.status(403).json({ success: false, message: "Access denied" });
      }
    } else {
      const isOwner = todo.userId.toString() === req.user.id.toString();
      const isAssignee = todo.assignedTo && todo.assignedTo.toString() === req.user.id.toString();
      if (!isOwner && !isAssignee) {
        return res.status(403).json({ success: false, message: "Access denied" });
      }
    }

    todo.status = status;
    todo.completed = status === "done";
    await todo.save();

    const populated = await todo.populate([
      { path: "assignedTo", select: "name email" },
      { path: "userId", select: "name email" },
    ]);

    res.status(200).json({
      success: true,
      message: "Task status updated",
      data: { todo: populated },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};