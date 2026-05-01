import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import auth from "./routes/auth.js";
import todos from "./routes/todos.js";
import categories from "./routes/categories.js";
import projects from "./routes/projects.js";

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || true,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);

app.use(cookieParser());
app.use(express.json({ limit: "16kb" }));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Routes
app.use("/api/auth", auth);
app.use("/api/todos", todos);
app.use("/api/categories", categories);
app.use("/api/projects", projects);

export { app };
