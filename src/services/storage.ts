const PREFIX = "autoflow_";

export const storage = {
  get<T>(key: string): T | null {
    if (typeof window === "undefined") return null;
    try {
      const item = localStorage.getItem(`${PREFIX}${key}`);
      return item ? (JSON.parse(item) as T) : null;
    } catch {
      return null;
    }
  },

  set<T>(key: string, value: T): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(`${PREFIX}${key}`, JSON.stringify(value));
  },

  remove(key: string): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(`${PREFIX}${key}`);
  },

  clear(): void {
    if (typeof window === "undefined") return;
    Object.keys(localStorage)
      .filter((k) => k.startsWith(PREFIX))
      .forEach((k) => localStorage.removeItem(k));
  },
};
