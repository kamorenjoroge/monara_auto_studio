import type { ReactNode } from "react";

// A REUSABLE TABLE for every admin list (cars, services, products...).
// You tell it the columns and the rows, and it draws the table.

export interface Column<T> {
  key: string; // a unique name for the column
  header: string; // the title at the top of the column
  render: (row: T) => ReactNode; // what to show in this column for one row
}

interface DataTableProps<T extends { id: string }> {
  columns: Column<T>[];
  rows: T[];
  actions?: (row: T) => ReactNode; // buttons shown at the end of each row
  emptyMessage?: string;
}

function DataTable<T extends { id: string }>({
  columns,
  rows,
  actions,
  emptyMessage = "Nothing to show yet.",
}: DataTableProps<T>) {
  if (rows.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b border-border bg-muted/60 text-xs uppercase tracking-wider text-muted-foreground">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="px-5 py-3 font-semibold">
                {column.header}
              </th>
            ))}
            {actions && <th className="px-5 py-3 text-right font-semibold">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row) => (
            <tr key={row.id} className="transition-colors hover:bg-muted/40">
              {columns.map((column) => (
                <td key={column.key} className="px-5 py-4 align-middle">
                  {column.render(row)}
                </td>
              ))}
              {actions && <td className="px-5 py-4 text-right align-middle">{actions(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;