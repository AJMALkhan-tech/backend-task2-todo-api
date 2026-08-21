const fs = require("fs/promises");
const { dataFilePath } = require("../config/config");

const readTasks = async () => {
  try {
    const data = await fs.readFile(dataFilePath, "utf-8");
    return data.trim() ? JSON.parse(data) : [];
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
};

const writeTasks = async (tasks) => {
  await fs.writeFile(dataFilePath, JSON.stringify(tasks, null, 2), "utf-8");
};

module.exports = { readTasks, writeTasks };