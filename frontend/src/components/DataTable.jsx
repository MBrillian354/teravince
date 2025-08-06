export default function DataTable({
  columns,
  data,
  rowKey = 'id',
  onRowClick,
  containerClass = 'card-static overflow-x-auto mb-6',
  variant = 'default',
  title = null,
  sortBy,
  sortOrder,
  onSort
}) {
  const handleSort = (column) => {
    if (column.sortable && onSort) {
      const newOrder = sortBy === column.accessor && sortOrder === 'asc' ? 'desc' : 'asc';
      onSort(column.accessor, newOrder);
    }
  };

  const getSortIcon = (column) => {
    if (!column.sortable) return null;
    
    if (sortBy === column.accessor) {
      return sortOrder === 'asc' ? ' ↑' : ' ↓';
    }
    return ' ↕';
  };

  if (variant === 'gradient') {
    return (
      <div className="card-static p-0 border border-primary/50 overflow-hidden flex flex-col mb-4">
        {title && (
          <div className="bg-gradient-to-r from-primary to-secondary px-6 py-4">
            <h2 className="text-lg font-semibold text-background">{title}</h2>
          </div>
        )}

        <div className="w-full overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary text-background">
              <tr>
                {columns.map((col, index) => (
                  <th
                    key={`header-${index}`}
                    className={`px-4 py-2 text-left font-medium whitespace-nowrap ${
                      col.sortable ? 'cursor-pointer hover:bg-primary transition-colors' : ''
                    }`}
                    onClick={() => handleSort(col)}
                  >
                    <div className="flex items-center">
                      <span>{typeof col.header === 'function' ? col.header() : col.header}</span>
                      {col.sortable && (
                        <span className="ml-1 text-xs opacity-70">
                          {getSortIcon(col)}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary">
              {data.map((row) => (
                <tr
                  key={row[rowKey]}
                  className={`${onRowClick ? 'hover:bg-gray-100 transition cursor-pointer' : ''}`}
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
                className={`p-3 text-${col.align || 'left'} ${
                  col.sortable ? 'cursor-pointer hover:bg-gray-200 transition-colors' : ''
                }`}
                onClick={() => handleSort(col)}
              >
                <div className="flex items-center">
                  <span>{typeof col.header === 'function' ? col.header() : col.header}</span>
                  {col.sortable && (
                    <span className="ml-1 text-xs opacity-70">
                      {getSortIcon(col)}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={row[rowKey]}
              className={`border-t cursor-pointer ${
                onRowClick ? 'hover:bg-gray-100' : ''
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
