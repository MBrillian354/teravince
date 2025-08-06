# Server-Side Filtering, Search, and Pagination Implementation

## Overview
Successfully implemented Approach 1: Enhanced API with Query Parameters for server-side data operations in the TeamTasks component.

## Backend Changes

### 1. Enhanced Task Controller (`backend/controllers/taskController.js`)
- **Updated `getAllTasks` function** to support query parameters:
  - `page`, `limit` - Pagination
  - `search` - Text search across task title, description, and employee names
  - `status` - Filter by task status
  - `biasStatus` - Filter by bias detection status
  - `sortBy`, `sortOrder` - Sorting options
  - `jobId` - Existing job filtering

- **Advanced Search Implementation**:
  - Uses MongoDB aggregation pipeline for searching in populated user fields
  - Searches across task title, description, employee first name, last name, and full name
  - Case-insensitive regex matching

- **Response Format**:
  ```json
  {
    "success": true,
    "data": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalTasks": 45,
      "hasNextPage": true,
      "hasPrevPage": false,
      "limit": 10
    }
  }
  ```

## Frontend Changes

### 1. Enhanced API (`frontend/src/utils/api.js`)
- Updated `tasksAPI.getAll()` to accept query parameters
- Automatically converts parameters to URL query string

### 2. New Custom Hook (`frontend/src/hooks/useServerTable.js`)
- **`useServerTable`** - Reusable hook for server-side table operations
- **Features**:
  - Automatic data fetching with parameter changes
  - Loading and error state management
  - Pagination state management
  - Parameter cleanup (removes empty values)
  - Convenient update functions:
    - `updateSearch(searchTerm)`
    - `updateFilter(key, value)`
    - `updateSort(sortBy, sortOrder)`
    - `changePage(page)`
    - `resetFilters()`

### 3. New Components

#### SearchInput (`frontend/src/components/SearchInput.jsx`)
- Debounced search input (500ms delay)
- Prevents excessive API calls while typing
- Customizable placeholder and styling

#### FilterSelect (`frontend/src/components/FilterSelect.jsx`)
- Reusable dropdown filter component
- Supports options array with value/label pairs
- Customizable placeholder and styling

### 4. Enhanced DataTable (`frontend/src/components/DataTable.jsx`)
- Added sorting support with visual indicators
- Click headers to sort (↑ ↓ ↕)
- Sortable columns are highlighted on hover
- Pass `sortBy`, `sortOrder`, and `onSort` props for server-side sorting

### 5. Updated TeamTasks Component (`frontend/src/pages/TeamTasks.jsx`)
- **Replaced client-side operations** with server-side using `useServerTable` hook
- **Added search and filter UI**:
  - Search box for tasks and employee names
  - Status filter dropdown
  - Bias status filter dropdown
  - Reset filters button
  - Results count display

- **Features**:
  - Real-time search with debouncing
  - Server-side pagination
  - Server-side sorting
  - Multiple filters can be applied simultaneously
  - Clear visual feedback when filters are active

## Usage Examples

### Basic Usage
```javascript
const {
  data,
  loading,
  error,
  pagination,
  updateSearch,
  updateFilter,
  changePage
} = useServerTable(tasksAPI.getAll);
```

### With Initial Parameters
```javascript
const serverTable = useServerTable(tasksAPI.getAll, {
  limit: 20,
  sortBy: 'title',
  sortOrder: 'asc'
});
```

### Search Implementation
```javascript
<SearchInput
  value={params.search}
  onChange={updateSearch}
  placeholder="Search tasks or staffs..."
/>
```

### Filter Implementation
```javascript
<FilterSelect
  value={params.status}
  onChange={(value) => updateFilter('status', value)}
  options={statusOptions}
  placeholder="All Statuses"
/>
```

## Benefits

1. **Performance**: Only loads data needed for current page
2. **Scalability**: Works efficiently with large datasets
3. **User Experience**: 
   - Debounced search prevents API spam
   - Real-time filtering and sorting
   - Clear visual feedback
4. **Reusability**: `useServerTable` hook can be used across all data tables
5. **Maintainability**: Centralized logic for server-side operations

## API Endpoints Supported

### GET /api/tasks
**Query Parameters:**
- `page` (number) - Page number (default: 1)
- `limit` (number) - Items per page (default: 10)
- `search` (string) - Search term
- `status` (string) - Task status filter
- `biasStatus` (string) - Bias status filter
- `sortBy` (string) - Field to sort by (default: 'startDate')
- `sortOrder` (string) - 'asc' or 'desc' (default: 'desc')
- `jobId` (string) - Filter by job ID

**Example:**
```
/api/tasks?page=2&limit=20&search=report&status=completed&sortBy=title&sortOrder=asc
```

## Next Steps for Other Components

To implement this pattern in other components (Reports, ManageJobs, etc.):

1. Update the respective controller (reportController.js, jobController.js)
2. Use the `useServerTable` hook
3. Add SearchInput and FilterSelect components
4. Update column definitions with `sortable: true`
5. Pass sorting props to DataTable

The pattern is now established and can be easily replicated across the application.
