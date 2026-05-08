type LogLevel = "info" | "warn" | "error" | "debug";

const isDev = process.env.NODE_ENV === "development";

function log(level: LogLevel, message: string, ...args: unknown[]) {
  if (!isDev && level === "debug") return;
  const prefix = `[AutoFlow:${level.toUpperCase()}]`;
  console[level === "debug" ? "log" : level](prefix, message, ...args);
}

export const logger = {
  info: (msg: string, ...args: unknown[]) => log("info", msg, ...args),
  warn: (msg: string, ...args: unknown[]) => log("warn", msg, ...args),
  error: (msg: string, ...args: unknown[]) => log("error", msg, ...args),
  debug: (msg: string, ...args: unknown[]) => log("debug", msg, ...args),
};
