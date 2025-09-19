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
    navigate('/login');
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
          {user && (
            <>
              <Button color="inherit" onClick={() => navigate('/books/manage')} sx={{ ml: 2 }}>
                Book Record
              </Button>
              <Button color="inherit" onClick={() => navigate('/members')} sx={{ ml: 2 }}>
                Members
              </Button>
              <Button color="inherit" onClick={() => navigate('/staff')} sx={{ ml: 2 }}>
                Staff
              </Button>
              <Button color="inherit" onClick={() => navigate('/transactions')} sx={{ ml: 2 }}>
                Transactions
              </Button>
              <Button color="inherit" onClick={() => navigate('/reservations')} sx={{ ml: 2 }}>
                Reservations
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<LibraryApp />} />
            <Route path="/books" element={<LibraryApp />} />
            <Route path="/books/manage" element={<BookRecordsList />} />
            <Route path="/members" element={<MembersList />} />
            <Route path="/staff" element={<StaffList />} />
            <Route path="/transactions" element={<TransactionList />} />
            <Route path="/reservations" element={<ReservationList />} />
          </Route>
        </Routes>
      </Container>
      <CreateUserModal open={createOpen} onClose={closeCreateModal} />
    </>
  );
};

export default AppLayout;
