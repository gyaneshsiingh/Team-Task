import Project from "../models/project.models.js";
import User from "../models/user.models.js";
import Todo from "../models/todo.models.js";

// ─── Create Project ──────────────────────────────────────────────────────────
export const createProject = async (req, res) => {
  try {
    const { name, description, color } = req.body;
    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Project name is required" });
    }

    const project = await Project.create({
      name: name.trim(),
      description: description?.trim() || "",
      color: color || "#3b82f6",
      owner: req.user.id,
      members: [{ user: req.user.id, role: "admin" }],
    });

    const populated = await project.populate("members.user", "name email");
    res.status(201).json({ success: true, data: { project: populated } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Get All Projects (user is member or owner) ───────────────────────────────
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ owner: req.user.id }, { "members.user": req.user.id }],
      status: "active",
    })
      .populate("members.user", "name email")
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: { projects } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Get Single Project ───────────────────────────────────────────────────────
export const getProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      $or: [{ owner: req.user.id }, { "members.user": req.user.id }],
    })
      .populate("members.user", "name email")
      .populate("owner", "name email");

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }
    res.status(200).json({ success: true, data: { project } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Update Project (Admin only) ──────────────────────────────────────────────
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    const member = project.members.find(
      (m) => m.user.toString() === req.user.id.toString()
    );
    if (!member || member.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can update the project",
      });
    }

    const { name, description, color } = req.body;
    if (name) project.name = name.trim();
    if (description !== undefined) project.description = description.trim();
    if (color) project.color = color;

    await project.save();
    const populated = await project.populate("members.user", "name email");
    res.status(200).json({ success: true, data: { project: populated } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Delete / Archive Project (Admin only) ────────────────────────────────────
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    if (project.owner.toString() !== req.user.id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Only the project owner can delete it" });
    }

    project.status = "archived";
    await project.save();
    res
      .status(200)
      .json({ success: true, message: "Project archived successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Add Member (Admin only) ──────────────────────────────────────────────────
export const addMember = async (req, res) => {
  try {
    const { email, role = "member" } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    const requestingMember = project.members.find(
      (m) => m.user.toString() === req.user.id.toString()
    );
    if (!requestingMember || requestingMember.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can add members",
      });
    }

    const userToAdd = await User.findOne({ email: email.toLowerCase() });
    if (!userToAdd) {
      return res
        .status(404)
        .json({ success: false, message: "User with that email not found" });
    }

    const alreadyMember = project.members.some(
      (m) => m.user.toString() === userToAdd._id.toString()
    );
    if (alreadyMember) {
      return res
        .status(400)
        .json({ success: false, message: "User is already a member" });
    }

    project.members.push({ user: userToAdd._id, role });
    await project.save();
    const populated = await project.populate("members.user", "name email");
    res.status(200).json({ success: true, data: { project: populated } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Remove Member (Admin only) ───────────────────────────────────────────────
export const removeMember = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    const requestingMember = project.members.find(
      (m) => m.user.toString() === req.user.id.toString()
    );
    if (!requestingMember || requestingMember.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Only admins can remove members" });
    }

    if (req.params.memberId === project.owner.toString()) {
      return res
        .status(400)
        .json({ success: false, message: "Cannot remove the project owner" });
    }

    project.members = project.members.filter(
      (m) => m.user.toString() !== req.params.memberId
    );
    await project.save();
    const populated = await project.populate("members.user", "name email");
    res.status(200).json({ success: true, data: { project: populated } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Update Member Role (Admin only) ─────────────────────────────────────────
export const updateMemberRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!["admin", "member"].includes(role)) {
      return res
        .status(400)
        .json({ success: false, message: "Role must be admin or member" });
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    const requestingMember = project.members.find(
      (m) => m.user.toString() === req.user.id.toString()
    );
    if (!requestingMember || requestingMember.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Only admins can change roles" });
    }

    const targetMember = project.members.find(
      (m) => m.user.toString() === req.params.memberId
    );
    if (!targetMember) {
      return res
        .status(404)
        .json({ success: false, message: "Member not found in project" });
    }

    targetMember.role = role;
    await project.save();
    const populated = await project.populate("members.user", "name email");
    res.status(200).json({ success: true, data: { project: populated } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Get Project Tasks ─────────────────────────────────────────────────────────
export const getProjectTasks = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      $or: [{ owner: req.user.id }, { "members.user": req.user.id }],
    });

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    const tasks = await Todo.find({
      projectId: req.params.id,
      isArchived: false,
    })
      .populate("assignedTo", "name email")
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: { tasks } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
