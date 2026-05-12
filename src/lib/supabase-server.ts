type OrderDirection = "asc" | "desc";

type QueryResult = {
  data: Row | Row[] | null;
  error: { message: string } | null;
};

type Row = Record<string, unknown>;

type TableState = Record<string, Row[]>;

type QueryState = {
  action: "select" | "insert" | "upsert";
  payload?: Row[];
  orderBy?: string;
  orderDirection?: OrderDirection;
  single: boolean;
  conflictKey?: string;
};

const globalState = globalThis as typeof globalThis & {
  __n4n0Db?: TableState;
};

const memoryDb: TableState = globalState.__n4n0Db ?? {
  bookings: [],
  clinics: [],
  invoices: [],
  expenses: [],
  admins: [],
};

globalState.__n4n0Db = memoryDb;

function getBaseUrl() {
  return process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
}

function getServiceKey() {
  return process.env.SUPABASE_SERVICE_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
}

function ensureTable(tableName: string) {
  if (!memoryDb[tableName]) {
    memoryDb[tableName] = [];
  }
  return memoryDb[tableName];
}

function sortRows(rows: Row[], orderBy?: string, orderDirection: OrderDirection = "asc") {
  if (!orderBy) {
    return rows;
  }

  return [...rows].sort((left, right) => {
    const leftValue = left[orderBy];
    const rightValue = right[orderBy];
    const leftTime = typeof leftValue === "string" ? Date.parse(leftValue) : Number(leftValue);
    const rightTime = typeof rightValue === "string" ? Date.parse(rightValue) : Number(rightValue);

    const leftComparable = Number.isNaN(leftTime) ? String(leftValue ?? "") : leftTime;
    const rightComparable = Number.isNaN(rightTime) ? String(rightValue ?? "") : rightTime;

    if (leftComparable < rightComparable) {
      return orderDirection === "asc" ? -1 : 1;
    }
    if (leftComparable > rightComparable) {
      return orderDirection === "asc" ? 1 : -1;
    }
    return 0;
  });
}

async function remoteSelect(tableName: string, state: QueryState): Promise<QueryResult> {
  const baseUrl = getBaseUrl();
  const serviceKey = getServiceKey();

  if (!baseUrl || !serviceKey) {
    const localRows = sortRows(ensureTable(tableName), state.orderBy, state.orderDirection);
    return { data: state.single ? localRows[0] ?? null : localRows, error: null };
  }

  const url = new URL(`${baseUrl.replace(/\/$/, "")}/rest/v1/${tableName}`);
  url.searchParams.set("select", "*");
  if (state.orderBy) {
    url.searchParams.set("order", `${state.orderBy}.${state.orderDirection ?? "asc"}`);
  }
  if (state.single) {
    url.searchParams.set("limit", "1");
  }

  const response = await fetch(url, {
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return { data: null, error: { message: `Supabase request failed (${response.status})` } };
  }

  const data = (await response.json()) as Row[];
  return { data: state.single ? data[0] ?? null : data, error: null };
}

async function remoteWrite(tableName: string, state: QueryState): Promise<QueryResult> {
  const baseUrl = getBaseUrl();
  const serviceKey = getServiceKey();

  if (!baseUrl || !serviceKey) {
    const table = ensureTable(tableName);
    const rows = state.payload ?? [];

    if (state.action === "insert") {
      table.push(...rows);
    } else if (state.action === "upsert") {
      for (const row of rows) {
        const conflictKey = state.conflictKey ?? "id";
        const conflictValue = row[conflictKey];
        const index = table.findIndex((existing) => existing[conflictKey] === conflictValue);

        if (index >= 0) {
          table[index] = { ...table[index], ...row };
        } else {
          table.push(row);
        }
      }
    }

    const localRows = sortRows(table, state.orderBy, state.orderDirection);
    return { data: state.single ? localRows[0] ?? null : localRows, error: null };
  }

  const url = new URL(`${baseUrl.replace(/\/$/, "")}/rest/v1/${tableName}`);
  if (state.action === "upsert" && state.conflictKey) {
    url.searchParams.set("on_conflict", state.conflictKey);
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      Prefer: state.action === "upsert"
        ? "resolution=merge-duplicates,return=representation"
        : "return=representation",
    },
    body: JSON.stringify(state.payload ?? []),
  });

  if (!response.ok) {
    return { data: null, error: { message: `Supabase write failed (${response.status})` } };
  }

  const data = (await response.json().catch(() => [])) as Row[];
  return { data: state.single ? data[0] ?? null : data, error: null };
}

class TableQueryBuilder {
  constructor(private readonly tableName: string, private readonly state: QueryState) {}

  select(_columns?: string) {
    this.state.action = "select";
    return this;
  }

  order(orderBy: string, options?: { ascending?: boolean }) {
    this.state.orderBy = orderBy;
    this.state.orderDirection = options?.ascending === false ? "desc" : "asc";
    return this;
  }

  single() {
    this.state.single = true;
    return this;
  }

  upsert(payload: Row | Row[], options?: { onConflict?: string }) {
    this.state.action = "upsert";
    this.state.payload = Array.isArray(payload) ? payload : [payload];
    this.state.conflictKey = options?.onConflict;
    return this;
  }

  insert(payload: Row | Row[]) {
    this.state.action = "insert";
    this.state.payload = Array.isArray(payload) ? payload : [payload];
    return this.execute();
  }

  async execute() {
    if (this.state.action === "select") {
      return remoteSelect(this.tableName, this.state);
    }

    return remoteWrite(this.tableName, this.state);
  }

  then<TResult1 = QueryResult, TResult2 = never>(
    onfulfilled?: ((value: QueryResult) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ) {
    return this.execute().then(onfulfilled, onrejected);
  }
}

export const supabaseServer = {
  from(tableName: string) {
    return new TableQueryBuilder(tableName, {
      action: "select",
      single: false,
    });
  },
};