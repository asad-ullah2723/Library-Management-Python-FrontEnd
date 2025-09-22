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
import { 
  AccountCircle, 
  ExitToApp, 
  Person, 
  VpnKey, 
  Home 
} from '@mui/icons-material';

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

const AppLayout = () => {
  const { user, logout } = useAuth();
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
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <Home sx={{ mr: 1 }} />
            Library Management System
          </Typography>
          
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

            return (
              <>
                {/* Nav items based on role: Member, Librarian, Admin */}
                {/* Book Record: members can search/view; librarians/admin manage */}
                {(() => {
                  // members: go to /books (search/view)
                  if (typeof user.role === 'string' && user.role.toLowerCase() === 'admin') {
                    return (
                      <Button color="inherit" onClick={() => navigate('/books/manage')} sx={{ ml: 2 }}>
                        Book Record
                      </Button>
                    );
                  }
                  if (typeof user.role === 'string' && user.role.toLowerCase() === 'librarian') {
                    return (
                      <Button color="inherit" onClick={() => navigate('/books/manage')} sx={{ ml: 2 }}>
                        Book Record
                      </Button>
                    );
                  }
                  // default member
                  return (
                    <Button color="inherit" onClick={() => navigate('/books')} sx={{ ml: 2 }}>
                      Book Record
                    </Button>
                  );
                })()}

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

                {/* Transactions: members see personal transactions; librarians/admins see full operations */}
                <Button color="inherit" onClick={() => navigate(user?.role && user.role.toLowerCase() === 'member' ? '/transactions/my' : '/transactions')} sx={{ ml: 2 }}>
                  Transactions
                </Button>

                {/* Reservations: members can reserve/cancel their own; librarians/admins manage */}
                <Button color="inherit" onClick={() => navigate(user?.role && user.role.toLowerCase() === 'member' ? '/reservations/my' : '/reservations')} sx={{ ml: 2 }}>
                  Reservations
                </Button>

                {/* Fines: members see/pays own; librarians/admins manage */}
                <Button color="inherit" onClick={() => navigate(user?.role && user.role.toLowerCase() === 'member' ? '/fines/my' : '/fines')} sx={{ ml: 2 }}>
                  Fines
                </Button>

                {/* System Logs & Reports: admin only */}
                {isAdmin && (
                  <Button color="inherit" onClick={() => navigate('/system-logs')} sx={{ ml: 2 }}>
                    System Logs & Reports
                  </Button>
                )}

                {/* Reports: members get personal reports; librarians/admins get broader access */}
                <Button color="inherit" onClick={() => navigate(user?.role && user.role.toLowerCase() === 'member' ? '/reports/personal' : '/reports')} sx={{ ml: 2 }}>
                  Reports
                </Button>
                {/* Dev-only auth debug button */}
                {process.env.NODE_ENV === 'development' && <AuthDebug />}
              </>
            );
          })()}
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<LibraryApp />} />
            <Route path="/books" element={<LibraryApp />} />

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
