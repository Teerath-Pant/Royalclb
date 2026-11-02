/** Data helpers that give the legacy templates rows shaped like the PHP queries returned them. */
import { api } from "@/lib/api";

const ISO = /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}:\d{2})(?:\.\d+)?Z$/;

/** "2026-10-26T23:20:00.000Z" -> "2026-10-26 23:20:00": the database holds IST wall-clock time, as MySQL prints it. */
export function phpRow<T>(value: T): T {
  if (typeof value === "string") {
    const m = ISO.exec(value);
    return (m ? `${m[1]} ${m[2]}` : value) as T;
  }
  if (Array.isArray(value)) {
    return value.map(phpRow) as T;
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, phpRow(v)])) as T;
  }
  return value;
}

type Page<T> = { data: T[]; totalPages: number };

/** Every row of a paginated route, which is what the old pages listed. */
export async function fetchAll<T>(path: string): Promise<T[]> {
  const rows: T[] = [];
  const sep = path.includes("?") ? "&" : "?";
  for (let page = 1; ; page++) {
    const res = await api<Page<T>>(`${path}${sep}page=${page}&limit=100`);
    rows.push(...res.data);
    if (page >= res.totalPages) {
      break;
    }
  }
  return phpRow(rows);
}

type IncomeRow = Record<string, unknown> & { from?: { uid: number | null; name: string; userId: string | null } | null };

/** Income rows carry the member they came from as `from`; the templates read it as name/uid. */
export function withFrom(row: IncomeRow) {
  return { ...row, name: row.from?.name, uid: row.from?.uid };
}
