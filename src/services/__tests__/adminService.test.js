import adminService from '../adminService';
import api from '../api';

jest.mock('../api');

describe('adminService', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('listUsers calls /admin/users/ with skip and limit', async () => {
    api.get.mockResolvedValue({ data: [{ id: 1, email: 'a@b.com' }] });

    const resp = await adminService.listUsers({ skip: 10, limit: 5, search: 'foo' });

    expect(api.get).toHaveBeenCalledWith('/admin/users/', { params: { skip: 10, limit: 5, search: 'foo' } });
    expect(resp.data).toEqual([{ id: 1, email: 'a@b.com' }]);
  });
});
