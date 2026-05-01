import express from 'express';
import {
  getTodos,
  getTodo,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodo,
  updateStatus,
} from '../controllers/todoController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

router.route('/').get(getTodos).post(createTodo);
router.route('/:id').get(getTodo).put(updateTodo).delete(deleteTodo);
router.patch('/:id/toggle', toggleTodo);
router.patch('/:id/status', updateStatus);

export default router;