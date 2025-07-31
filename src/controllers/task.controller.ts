import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import tasks from "../models/task.model";
import { Task } from "../types/task";
import { ValidationError } from "../middlewares/error-handlers";

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

export const createTask = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description, status } = req.body;

    if (!title || !status) {
      return next(new ValidationError("Title and status are required!"));
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
