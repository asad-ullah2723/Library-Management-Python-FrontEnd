# Admin Dashboard Frontend Helpers

This file documents the small service and hooks added to help implement the Admin Dashboard (Users & Books).

Files added
- `src/services/api.js` — axios instance with request/response interceptors that attach `access_token` from localStorage and redirect to `/login` on 401.
- `src/services/adminService.js` — wrappers for admin endpoints (`/admin/users` and `/admin/books`).
- `src/hooks/useAdminUsers.js` — React hook for listing, creating, updating, deleting users (server pagination support).
- `src/hooks/useAdminBooks.js` — React hook for listing, creating, updating, deleting books (server pagination & filters).

Usage examples

1) Login and store token (example in a Login component):

```javascript
// after successful login response
localStorage.setItem('access_token', response.data.access_token);
```

2) Use hooks in components

Users list example:

```javascript
import { useAdminUsers } from '../src/hooks/useAdminUsers';

function UsersPage() {
  const { users, loading, error, page, setPage, total } = useAdminUsers();

  // render table, pagination controls
}
```

Books list example:

```javascript
import { useAdminBooks } from '../src/hooks/useAdminBooks';

function BooksPage() {
  const { books, loading, setFilters } = useAdminBooks();

  // render table, filter controls
}
```

Notes
- The hooks expect backend responses to be arrays for list endpoints. If the backend returns a `{ data: [...], total: N }` envelope, the hooks will try to read `resp.data.total` and set `total` accordingly.
- Adjust `localStorage` key if your project uses a different key for tokens.
- For production, consider a more robust auth/token refresh approach.

Environment / proxy notes
- The project uses CRA's `proxy` in `package.json` for local development which forwards relative requests to the backend (see `proxy` value). If you prefer to point directly to an API server, set the `REACT_APP_API_URL` environment variable (for example `http://localhost:9000`).

Example (Windows PowerShell):

```powershell
$env:REACT_APP_API_URL = 'http://localhost:9000'; npm start
```

