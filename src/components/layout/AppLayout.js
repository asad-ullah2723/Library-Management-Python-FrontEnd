import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Menu, 
  MenuItem, 
  Box, 
  Divider,
  Container
} from '@mui/material';
import { AccountCircle, ExitToApp, Person, VpnKey, Brightness4, Brightness7 } from '@mui/icons-material';

// Auth Components
import { useAuth } from '../../contexts/AuthContext';
import PrivateRoute from '../auth/PrivateRoute';
import AdminRoute from '../auth/AdminRoute';
import RoleRoute from '../auth/RoleRoute';
import Login from '../auth/Login';
import Register from '../auth/Register';
import ForgotPassword from '../auth/ForgotPassword';
import ResetPassword from '../auth/ResetPassword';

// Main App Components
import LibraryApp from '../books/LibraryApp';
import BookRecordsList from '../books/BookRecordsList';
import CreateUserModal from '../admin/CreateUserModal';
import MembersList from '../members/MembersList';
import StaffList from '../staff/StaffList';
import TransactionList from '../transactions/TransactionList';
import ReservationList from '../reservations/ReservationList';
import FineList from '../fines/FineList';
import SystemLogsReports from '../system/SystemLogsReports';
import ReportsOverview from '../reports/ReportsOverview';
import DailyActivityReport from '../reports/DailyActivityReport';
import AuthDebug from '../auth/AuthDebug';

import { useThemeMode } from '../../theme/ThemeModeContext';
import HeaderSearch from './HeaderSearch';

const AppLayout = () => {
  const { user, logout } = useAuth();
  const { mode, toggleMode } = useThemeMode();
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
  };

  const [createOpen, setCreateOpen] = useState(false);
  const openCreateModal = () => { setCreateOpen(true); handleClose(); };
  const closeCreateModal = () => setCreateOpen(false);

  // Don't show app bar on auth pages
  const isAuthPage = ['/login', '/register', '/forgot-password', '/reset-password'].includes(location.pathname);
  
  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar sx={{ display: 'flex', alignItems: 'center' }}>
          {/* left: logo + simple nav button for small screens */}
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <img src="/libroMatrix1.png" alt="LibroMatrix" style={{ height: 60, marginRight: 12 }} />
            <Typography variant="h6" component="div" sx={{ display: { xs: 'none', sm: 'block' } }}>
              LibroMatrix
            </Typography>
          </Box>

          {/* centered search */}
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <HeaderSearch onSearch={(q) => {
              // navigate to library search page with query
              if (q) navigate(`/books?search=${encodeURIComponent(q)}`);
              else navigate('/books');
            }} />
          </Box>

          {/* right: auth actions + theme */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {user ? (
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <Box sx={{ px: 2, py: 1 }}>
                  <Typography variant="subtitle1">{user.name || user.email}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user.email}
                  </Typography>
                </Box>
                <Divider />
                <MenuItem onClick={() => { handleClose(); handleLogout(); }}>
                  <ExitToApp fontSize="small" sx={{ mr: 1 }} />
                  Logout
                </MenuItem>
                {user?.role === 'admin' && (
                  <MenuItem onClick={openCreateModal}>
                    <Person fontSize="small" sx={{ mr: 1 }} />
                    Create User
                  </MenuItem>
                )}
              </Menu>
            </div>
          ) : (
            <>
              <Button 
                color="inherit" 
                onClick={() => navigate('/login')}
                startIcon={<VpnKey />}
              >
                Login
              </Button>
              <Button 
                color="inherit" 
                onClick={() => navigate('/register')}
                startIcon={<Person />}
              >
                Register
              </Button>
            </>
          )}
            {/* theme toggle */}
            <IconButton sx={{ ml: 1 }} color="inherit" onClick={toggleMode}>
              {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Box>

          {user && (() => {
            const isAdmin = (() => {
              if (!user) return false;
              if (typeof user.role === 'string' && user.role.toLowerCase() === 'admin') return true;
              if (user.is_admin === true) return true;
              if (Array.isArray(user.roles) && user.roles.includes('admin')) return true;
              try {
                const token = localStorage.getItem('access_token') || localStorage.getItem('token');
                if (token) {
                  const b64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
                  const payload = JSON.parse(atob(b64));
                  const tokRole = payload?.role || (payload?.data && payload.data.role);
                  if (typeof tokRole === 'string' && tokRole.toLowerCase() === 'admin') return true;
                }
              } catch (e) {
                // ignore
              }
              return false;
            })();

            const isLibrarian = (() => {
              if (!user) return false;
              if (typeof user.role === 'string' && user.role.toLowerCase() === 'librarian') return true;
              if (user.is_librarian === true) return true;
              if (Array.isArray(user.roles) && user.roles.includes('librarian')) return true;
              try {
                const token = localStorage.getItem('access_token') || localStorage.getItem('token');
                if (token) {
                  const b64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
                  const payload = JSON.parse(atob(b64));
                  const tokRole = payload?.role || (payload?.data && payload.data.role);
                  if (typeof tokRole === 'string' && tokRole.toLowerCase() === 'librarian') return true;
                }
              } catch (e) {
                // ignore
              }
              return false;
            })();

            const isMember = !!user && !isAdmin && !isLibrarian;

            return (
              <>
                {/* Nav items based on role: Member, Librarian, Admin */}
                {/* Book Record: only show to librarians/admins (hide for regular members) */}
                {!isMember && (isAdmin || isLibrarian) && (
                  <Button color="inherit" onClick={() => navigate('/books/manage')} sx={{ ml: 2 }}>
                    Book Record
                  </Button>
                )}

                {/* Members list: librarians and admins */}
                {(() => {
                  if (isAdmin) return (
                    <Button color="inherit" onClick={() => navigate('/members')} sx={{ ml: 2 }}>
                      Members
                    </Button>
                  );
                  // allow librarians
                  if (user?.is_librarian === true || (Array.isArray(user?.roles) && user.roles.includes('librarian'))) {
                    return (
                      <Button color="inherit" onClick={() => navigate('/members')} sx={{ ml: 2 }}>
                        Members
                      </Button>
                    );
                  }
                  return null;
                })()}

                {/* Staff management: admin only */}
                {isAdmin && (
                  <Button color="inherit" onClick={() => navigate('/staff')} sx={{ ml: 2 }}>
                    Staff
                  </Button>
                )}

                {/* Transactions: hide for regular members (members won't see this nav) */}
                {!isMember && (
                  <Button color="inherit" onClick={() => navigate('/transactions')} sx={{ ml: 2 }}>
                    Transactions
                  </Button>
                )}

                {/* Reservations: hide nav for regular members; librarians/admins manage */}
                {!isMember && (
                  <Button color="inherit" onClick={() => navigate('/reservations')} sx={{ ml: 2 }}>
                    Reservations
                  </Button>
                )}

                {/* Fines: hide for regular members in the nav */}
                {!isMember && (
                  <Button color="inherit" onClick={() => navigate('/fines')} sx={{ ml: 2 }}>
                    Fines
                  </Button>
                )}

                {/* System Logs & Reports: admin only */}
                {isAdmin && (
                  <Button color="inherit" onClick={() => navigate('/system-logs')} sx={{ ml: 2 }}>
                    System Logs & Reports
                  </Button>
                )}

                {/* Reports: hide for regular members */}
                {!isMember && (
                  <Button color="inherit" onClick={() => navigate('/reports')} sx={{ ml: 2 }}>
                    Reports
                  </Button>
                )}
                {/* Dev-only auth debug button (only for non-members in development) */}
                {process.env.NODE_ENV === 'development' && !isMember && <AuthDebug />}
              </>
            );
          })()}
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Routes>
          {/* Public home and books listing */}
          <Route path="/" element={<LibraryApp />} />
          <Route path="/books" element={<LibraryApp />} />

          {/* Auth pages are handled earlier; protected routes below */}
          <Route element={<PrivateRoute />}>
            {/* Personal/member routes */}
            <Route path="/transactions/my" element={<TransactionList personal={true} />} />
            <Route path="/reservations/my" element={<ReservationList personal={true} />} />
            <Route path="/fines/my" element={<FineList personal={true} />} />
            <Route path="/reports/personal" element={<ReportsOverview personal={true} />} />

            {/* Librarian+Admin routes */}
            <Route element={<RoleRoute allowedRoles={["librarian", "admin"]} />}>
              <Route path="/books/manage" element={<BookRecordsList />} />
              <Route path="/members" element={<MembersList />} />
              <Route path="/transactions" element={<TransactionList />} />
              <Route path="/reservations" element={<ReservationList />} />
              <Route path="/fines" element={<FineList />} />
            </Route>

            {/* Admin-only routes */}
            <Route element={<RoleRoute allowedRoles={["admin"]} />}>
              <Route path="/staff" element={<StaffList />} />
              <Route path="/system-logs" element={<SystemLogsReports />} />
              <Route path="/reports" element={<ReportsOverview />} />
              <Route path="/reports/daily" element={<DailyActivityReport />} />
            </Route>
          </Route>
        </Routes>
      </Container>
      <CreateUserModal open={createOpen} onClose={closeCreateModal} />
    </>
  );
};

export default AppLayout;
