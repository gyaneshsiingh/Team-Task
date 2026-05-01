import express from "express";
import {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
  updateMemberRole,
  getProjectTasks,
} from "../controllers/projectController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();
router.use(protect);

// Project CRUD
router.route("/").get(getProjects).post(createProject);
router.route("/:id").get(getProject).put(updateProject).delete(deleteProject);

// Member management
router.post("/:id/members", addMember);
router.delete("/:id/members/:memberId", removeMember);
router.patch("/:id/members/:memberId/role", updateMemberRole);

// Project tasks
router.get("/:id/tasks", getProjectTasks);

export default router;
