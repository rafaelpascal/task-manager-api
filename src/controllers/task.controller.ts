import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import tasks from "../models/task.model";
import { Task } from "../types/task";
import { ValidationError } from "../middlewares/error-handlers";

/**
 * @api {get} /tasks Get all tasks
 * @apiName GetTasks
 * @apiGroup Tasks
 * @apiDescription Get all tasks with pagination and filtering by status
 * @apiParam (Query) {string} [status] Task status
 * @apiParam (Query) {string} [page=1] Page number
 * @apiParam (Query) {string} [limit=10] Number of items per page
 * @apiSuccess {number} total Total number of items
 * @apiSuccess {Task[]} data Array of tasks
 * @apiError (401) AuthenticationError Authentication failed
 * @apiError (500) ValidationError Invalid request data
 */
export const getAllTasks = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status, page = "1", limit = "10" } = req.query;
    let filtered = tasks;

    if (status) filtered = filtered.filter((t) => t.status === status);

    const start = (parseInt(page as string) - 1) * parseInt(limit as string);
    const paginated = filtered.slice(start, start + parseInt(limit as string));

    res.json({ total: filtered.length, data: paginated });
  } catch (error) {
    next(error);
  }
};

/**
 * @api {get} /tasks/:id Get task by ID
 * @apiName GetTaskById
 * @apiGroup Tasks
 * @apiDescription Retrieve a specific task by its ID.
 * @apiParam (Path) {string} id Task ID
 * @apiSuccess {Task} task The task object
 * @apiError (404) {Object} error Task not found
 * @apiError (500) {Object} error Internal server error
 */

export const getTaskById = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const task = tasks.find((t) => t.id === req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  } catch (error) {
    next(error);
  }
};

/**
 * @api {post} /tasks Create a new task
 * @apiName CreateTask
 * @apiGroup Tasks
 * @apiDescription Create a new task.
 * @apiParam (Body) {string} title Task title
 * @apiParam (Body) {string} description Task description
 * @apiParam (Body) {string} status Task status (pending | completed)
 * @apiSuccess {Task} task The newly created task
 * @apiError (400) {Object} error Missing required fields
 * @apiError (500) {Object} error Internal server error
 */
export const createTask = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description, status } = req.body;

    if (!title || !description || !status) {
      return next(new ValidationError("Missing required fields!"));
    }

    const newTask: Task = {
      id: uuidv4(),
      title,
      description,
      status,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    tasks.push(newTask);
    res.status(201).json(newTask);
  } catch (error) {
    next(error);
  }
};

/**
 * @api {put} /tasks/:id Update a task
 * @apiName UpdateTask
 * @apiGroup Tasks
 * @apiDescription Update a task.
 * @apiParam (Path) {string} id Task ID
 * @apiParam (Body) {string} title Task title (optional)
 * @apiParam (Body) {string} description Task description (optional)
 * @apiParam (Body) {string} status Task status (pending | completed) (optional)
 * @apiSuccess {Task} task The updated task
 * @apiError (400) {Object} error Missing required fields
 * @apiError (404) {Object} error Task not found
 * @apiError (500) {Object} error Internal server error
 */
export const updateTask = (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = tasks.find((t) => t.id === req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    const { title, description, status } = req.body;
    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (status) task.status = status;

    task.updatedAt = new Date();
    res.json(task);
  } catch (error) {
    next(error);
  }
};

/**
 * @api {delete} /tasks/:id Delete a task
 * @apiName DeleteTask
 * @apiGroup Tasks
 * @apiDescription Delete a specific task by its ID.
 * @apiParam (Path) {string} id Task ID
 * @apiSuccess (204) NoContent Task successfully deleted
 * @apiError (404) {Object} error Task not found
 * @apiError (500) {Object} error Internal server error
 */

export const deleteTask = (req: Request, res: Response, next: NextFunction) => {
  try {
    const index = tasks.findIndex((t) => t.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "Task not found" });

    tasks.splice(index, 1);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
