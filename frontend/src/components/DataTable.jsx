export default function DataTable({
  columns,
  data,
  rowKey = 'id',
  onRowClick,
  containerClass = 'bg-surface rounded shadow overflow-x-auto mb-6',
  variant = 'default',
  title = null
}) {
  if (variant === 'gradient') {
    return (
      <div className="bg-surface rounded-lg shadow-md border border-primary overflow-hidden flex flex-col mb-4">
        {title && (
          <div className="bg-gradient-to-r from-danger to-secondary px-5 py-3">
            <h2 className="text-lg font-semibold text-background">{title}</h2>
          </div>
        )}

        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-background">
              <tr>
                {columns.map((col, index) => (
                  <th
                    key={`header-${index}`}
                    className="px-4 py-2 text-left font-medium whitespace-nowrap"
                  >
                    {typeof col.header === 'function' ? col.header() : col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary">
              {data.map((row) => (
                <tr
                  key={row[rowKey]}
                  className="hover:bg-surface-hover transition"
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {columns.map((col, index) => (
                    <td
                      key={`cell-${index}`}
                      className="px-4 py-2"
                    >
                      {col.render
                        ? col.render(row)
                        : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={containerClass}>
      <table className="min-w-full">
        <thead className="bg-muted">
          <tr>
            {columns.map((col, index) => (
              <th
                key={`header-${index}`}
                className={`p-3 text-${col.align || 'left'}`}
              >
                {typeof col.header === 'function' ? col.header() : col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={row[rowKey]}
              className={`border-t cursor-pointer ${
                onRowClick ? 'hover:bg-surface-hover' : ''
              }`}
              onClick={() => onRowClick && onRowClick(row)}
            >
              {columns.map((col, index) => (
                <td
                  key={`cell-${index}`}
                  className={`p-3 text-${col.align || 'left'}`}
                >
                  {col.render
                    ? col.render(row)
                    : /* fallback to simple accessor */ row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
