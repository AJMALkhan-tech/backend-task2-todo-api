const { randomUUID } = require("crypto");
const { readTasks, writeTasks } = require("../models/taskModel");
const { AppError } = require("../middleware/errorHandler");

const VALID_PRIORITY = ["Low", "Medium", "High"];
const VALID_STATUS = ["Pending", "InProgress", "Completed"];

const validateTaskInput = (body, isUpdate = false) => {
  const { title, priority, status, dueDate } = body;

  if (!isUpdate && (!title || typeof title !== "string")) {
    return "title is required and must be a string";
  }
  if (priority !== undefined && !VALID_PRIORITY.includes(priority)) {
    return `priority must be one of: ${VALID_PRIORITY.join(", ")}`;
  }
  if (status !== undefined && !VALID_STATUS.includes(status)) {
    return `status must be one of: ${VALID_STATUS.join(", ")}`;
  }
  if (dueDate !== undefined && isNaN(Date.parse(dueDate))) {
    return "dueDate must be a valid date string";
  }
  return null;
};

// POST /api/tasks
const createTask = async (req, res, next) => {
  try {
    const validationError = validateTaskInput(req.body);
    if (validationError) throw new AppError(validationError, 400);

    const { title, description, priority, status, dueDate } = req.body;
    const tasks = await readTasks();
    const now = new Date().toISOString();

    const newTask = {
      id: randomUUID(),
      title,
      description: description || "",
      priority: priority || "Medium",
      status: status || "Pending",
      dueDate: dueDate || null,
      createdAt: now,
      updatedAt: now,
    };

    tasks.push(newTask);
    await writeTasks(tasks);

    console.log(`[CREATE] Task created: ${newTask.id}`);
    res.status(201).json({ success: true, data: newTask });
  } catch (error) {
    next(error);
  }
};

// GET /api/tasks?page=&limit=&status=&sort=
const getAllTasks = async (req, res, next) => {
  try {
    let tasks = await readTasks();
    const { status, sort, page = 1, limit = 10 } = req.query;

    if (status) {
      if (!VALID_STATUS.includes(status)) {
        throw new AppError(`status must be one of: ${VALID_STATUS.join(", ")}`, 400);
      }
      tasks = tasks.filter((t) => t.status === status);
    }

    if (sort === "asc" || sort === "desc") {
      tasks.sort((a, b) => {
        const dateA = new Date(a.dueDate || 0);
        const dateB = new Date(b.dueDate || 0);
        return sort === "asc" ? dateA - dateB : dateB - dateA;
      });
    }

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.max(parseInt(limit, 10) || 10, 1);
    const startIndex = (pageNum - 1) * limitNum;
    const paginated = tasks.slice(startIndex, startIndex + limitNum);

    res.status(200).json({
      success: true,
      total: tasks.length,
      page: pageNum,
      limit: limitNum,
      data: paginated,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/tasks/:id
const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tasks = await readTasks();
    const task = tasks.find((t) => t.id === id);

    if (!task) throw new AppError(`Task not found for id: ${id}`, 404);

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

// PUT /api/tasks/:id
const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const validationError = validateTaskInput(req.body, true);
    if (validationError) throw new AppError(validationError, 400);

    const tasks = await readTasks();
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) throw new AppError(`Task not found for id: ${id}`, 404);

    const { title, description, priority, status, dueDate } = req.body;
    const updatedTask = {
      ...tasks[index],
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(priority !== undefined && { priority }),
      ...(status !== undefined && { status }),
      ...(dueDate !== undefined && { dueDate }),
      updatedAt: new Date().toISOString(),
    };

    tasks[index] = updatedTask;
    await writeTasks(tasks);

    console.log(`[UPDATE] Task updated: ${id}`);
    res.status(200).json({ success: true, data: updatedTask });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/tasks/:id
const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tasks = await readTasks();
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) throw new AppError(`Task not found for id: ${id}`, 404);

    tasks.splice(index, 1);
    await writeTasks(tasks);

    console.log(`[DELETE] Task deleted: ${id}`);
    res.status(200).json({ success: true, message: `Task ${id} deleted` });
  } catch (error) {
    next(error);
  }
};

module.exports = { createTask, getAllTasks, getTaskById, updateTask, deleteTask };