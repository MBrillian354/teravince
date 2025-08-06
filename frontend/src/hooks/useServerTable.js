import { useState, useEffect, useCallback, useMemo } from 'react';
import { debounce } from 'lodash';

/**
 * Custom hook for managing server-side table operations
 * @param {Function} apiCall - The API function to call for data
 * @param {Object} initialParams - Initial parameters for the API call
 * @returns {Object} - State and functions for table management
 */
export const useServerTable = (apiCall, initialParams = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalTasks: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 10
  });
  
  const [params, setParams] = useState(() => ({
    page: 1,
    limit: 10,
    sortBy: 'startDate',
    sortOrder: 'desc',
    search: '',
    status: '',
    biasStatus: '',
    ...initialParams
  }));

  // Create a stable string representation of params for dependency
  const paramsKey = useMemo(() => {
    const normalizedParams = {
      page: params.page || 1,
      limit: params.limit || 10,
      sortBy: params.sortBy || '',
      sortOrder: params.sortOrder || '',
      search: params.search || '',
      status: params.status || '',
      biasStatus: params.biasStatus || ''
    };
    return JSON.stringify(normalizedParams);
  }, [params]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Clean up params - remove empty values
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, value]) => 
          value !== '' && value !== null && value !== undefined
        )
      );
      
      const response = await apiCall(cleanParams);
      
      if (response.data.success) {
        setData(response.data.data);
        setPagination(response.data.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalTasks: response.data.data.length,
          hasNextPage: false,
          hasPrevPage: false,
          limit: 10
        });
      } else {
        setError('Failed to fetch data');
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.response?.data?.msg || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [apiCall, paramsKey]); // Use stable params key

  // Debounce the fetchData function to reduce frequent calls
  const debouncedFetchData = useCallback(debounce(fetchData, 300), [fetchData]);

  useEffect(() => {
    debouncedFetchData();
    return () => {
      debouncedFetchData.cancel();
    };
  }, [debouncedFetchData]);

  // Update parameters and reset to page 1 (except for page changes)
  const updateParams = useCallback((newParams) => {
    setParams(prev => {
      const updated = { ...prev, ...newParams };
      // Reset to page 1 if we're not just changing the page
      if (!newParams.hasOwnProperty('page')) {
        updated.page = 1;
      }
      return updated;
    });
  }, []);

  // Change page without resetting other params
  const changePage = useCallback((page) => {
    setParams(prev => ({ ...prev, page }));
  }, []);

  // Update sorting
  const updateSort = useCallback((sortBy, sortOrder) => {
    updateParams({ sortBy, sortOrder });
  }, [updateParams]);

  // Update search
  const updateSearch = useCallback((search) => {
    updateParams({ search });
  }, [updateParams]);

  // Update filters
  const updateFilter = useCallback((filterKey, filterValue) => {
    updateParams({ [filterKey]: filterValue });
  }, [updateParams]);

  // Optimize resetFilters to only update params when necessary
  const resetFilters = useCallback(() => {
    const defaultParams = {
      page: 1,
      limit: params.limit,
      sortBy: 'startDate',
      sortOrder: 'desc'
    };

    // Only update if params actually changed
    const currentParamsString = JSON.stringify(params);
    const defaultParamsString = JSON.stringify(defaultParams);
    
    if (currentParamsString !== defaultParamsString) {
      setParams(defaultParams);
    }
  }, [params.limit]); // Only depend on limit, not all params

  return {
    // Data
    data,
    loading,
    error,
    pagination,
    params,
    
    // Actions
    updateParams,
    changePage,
    updateSort,
    updateSearch,
    updateFilter,
    resetFilters,
    refetch: fetchData
  };
};

export default useServerTable;
