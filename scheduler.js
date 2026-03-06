import { spawn } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TASKS = [
  {
    name: "buySuanli",
    script: "buySuanli.js",
    times: ["09:00:05"],
  },
  {
    name: "autoMaq",
    script: "autoMaq.js",
    times: ["12:00:00", "23:00:00"],
  },
];

const runningTasks = new Set();

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const getNextRunAt = (timeText, now = new Date()) => {
  const [hours, minutes, seconds] = timeText.split(":").map(Number);
  const runAt = new Date(now);
  runAt.setHours(hours, minutes, seconds, 0);

  if (runAt <= now) {
    runAt.setDate(runAt.getDate() + 1);
  }

  return runAt;
};

const runTask = (task) => {
  if (runningTasks.has(task.name)) {
    console.log(`[skip] ${task.name} is already running.`);
    return;
  }

  runningTasks.add(task.name);
  const scriptPath = resolve(__dirname, task.script);
  const startedAt = new Date();

  console.log(`[run] ${task.name} started at ${formatDate(startedAt)}`);
  const child = spawn(process.execPath, [scriptPath], {
    cwd: __dirname,
    stdio: "inherit",
  });

  child.on("error", (error) => {
    console.error(`[error] ${task.name} failed to start:`, error);
    runningTasks.delete(task.name);
  });

  child.on("close", (code, signal) => {
    const endedAt = new Date();
    if (code === 0) {
      console.log(`[done] ${task.name} finished at ${formatDate(endedAt)}`);
    } else {
      console.error(
        `[error] ${task.name} exited with code ${code ?? "null"} signal ${
          signal ?? "null"
        } at ${formatDate(endedAt)}`
      );
    }
    runningTasks.delete(task.name);
  });
};

const scheduleTask = (task, timeText) => {
  const now = new Date();
  const runAt = getNextRunAt(timeText, now);
  const waitMs = runAt.getTime() - now.getTime();

  console.log(
    `[schedule] ${task.name} will run at ${formatDate(runAt)} (time: ${timeText})`
  );

  setTimeout(() => {
    runTask(task);
    scheduleTask(task, timeText);
  }, waitMs);
};

console.log(`[boot] scheduler started at ${formatDate(new Date())}`);
for (const task of TASKS) {
  for (const timeText of task.times) {
    scheduleTask(task, timeText);
  }
}
