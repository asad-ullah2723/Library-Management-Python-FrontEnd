import { useState, useEffect, useCallback } from 'react';
import adminService from '../services/adminService';

export function useAdminUsers({ initialPage = 0, pageSize = 20, initialSearch = '' } = {}) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(initialPage);
  const [search, setSearch] = useState(initialSearch);
  const [total, setTotal] = useState(null);

  const fetch = useCallback(async (opts = {}) => {
    setLoading(true);
    setError(null);
    try {
      const skip = (opts.page ?? page) * (opts.pageSize ?? pageSize);
      const limit = opts.pageSize ?? pageSize;
      const resp = await adminService.listUsers({ skip, limit, search: opts.search ?? search });
      // Expecting backend to return List[User]; if it includes total, adapt as needed
      setUsers(resp.data || []);
      // Try to infer total if backend provides it
      if (resp.data && resp.data.total !== undefined) setTotal(resp.data.total);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search]);

  useEffect(() => {
    fetch({ page, pageSize, search });
  }, [fetch, page, pageSize, search]);

  const createUser = async (data) => {
    const resp = await adminService.createUser(data);
    await fetch();
    return resp;
  };

  const updateUser = async (id, patch) => {
    const resp = await adminService.updateUser(id, patch);
    await fetch();
    return resp;
  };

  const deleteUser = async (id) => {
    const resp = await adminService.deleteUser(id);
    await fetch();
    return resp;
  };

  return {
    users,
    loading,
    error,
    page,
    setPage,
    search,
    setSearch,
    total,
    refresh: () => fetch({ page, pageSize, search }),
    createUser,
    updateUser,
    deleteUser,
  };
}
