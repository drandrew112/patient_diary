import type { EventFile } from "./types";

export function nowForDatetimeLocal() {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
}

export function normalizeDateTimeForMysql(value: string) {
  return value.replace("T", " ") + ":00";
}

export function parseFiles(value: EventFile[] | string[] | string | null): EventFile[] {
  if (!value) return [];

  let parsed: unknown = value;

  if (typeof value === "string") {
    try {
      parsed = JSON.parse(value);
    } catch {
      return [];
    }
  }

  if (!Array.isArray(parsed)) return [];

  return parsed
    .map((file): EventFile | null => {
      if (typeof file === "string") {
        const name = file.split("/").pop() || file;

        return {
          path: file,
          name,
          displayName: name.replace(/\.[^/.]+$/, "")
        };
      }

      if (!file || typeof file !== "object") {
        return null;
      }

      const item = file as Record<string, unknown>;

      const path = typeof item.path === "string" ? item.path : "";
      const rawName = typeof item.name === "string" ? item.name : "";
      const rawDisplayName =
        typeof item.displayName === "string" ? item.displayName : "";

      const fallbackName = path ? path.split("/").pop() || path : "";

      const name = rawName || fallbackName;

      return {
        path,
        name,
        displayName:
          rawDisplayName ||
          name.replace(/\.[^/.]+$/, "") ||
          fallbackName.replace(/\.[^/.]+$/, "")
      };
    })
    .filter((file): file is EventFile => Boolean(file?.path));
}

export function getFileKind(path: string): "image" | "video" | "pdf" | "other" {
  const ext = path.split(".").pop()?.toLowerCase();

  if (!ext) return "other";
  if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext)) return "image";
  if (["mp4", "webm", "ogg", "mov"].includes(ext)) return "video";
  if (ext === "pdf") return "pdf";

  return "other";
}

export function toDatetimeLocal(value: string): string {
  if (!value) return nowForDatetimeLocal();
  return value.replace(" ", "T").slice(0, 16);
}
