import { useState, useEffect, useCallback } from 'react';
import adminService from '../services/adminService';

export function useAdminBooks({ initialPage = 0, pageSize = 20, initialFilters = {} } = {}) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(initialPage);
  const [filters, setFilters] = useState(initialFilters);
  const [total, setTotal] = useState(null);

  const fetch = useCallback(async (opts = {}) => {
    setLoading(true);
    setError(null);
    try {
      const skip = (opts.page ?? page) * (opts.pageSize ?? pageSize);
      const limit = opts.pageSize ?? pageSize;
      const params = { skip, limit, ...(opts.filters ?? filters) };
      const resp = await adminService.listBooks(params);
      setBooks(resp.data || []);
      if (resp.data && resp.data.total !== undefined) setTotal(resp.data.total);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, filters]);

  useEffect(() => {
    fetch({ page, pageSize, filters });
  }, [fetch, page, pageSize, filters]);

  const createBook = async (data) => {
    const resp = await adminService.createBook(data);
    await fetch();
    return resp;
  };

  const updateBook = async (id, patch) => {
    const resp = await adminService.updateBook(id, patch);
    await fetch();
    return resp;
  };

  const deleteBook = async (id) => {
    const resp = await adminService.deleteBook(id);
    await fetch();
    return resp;
  };

  return {
    books,
    loading,
    error,
    page,
    setPage,
    filters,
    setFilters,
    total,
    refresh: () => fetch({ page, pageSize, filters }),
    createBook,
    updateBook,
    deleteBook,
  };
}
