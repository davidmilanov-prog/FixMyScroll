import React from 'react';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DispatchSheet from './DispatchSheet';

import { AppBar, Toolbar, IconButton, Typography, Button, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';

function App() {
  return (
    <>
      <ToastContainer
        className="toast-container"
        position="top-right"
        style={{ top: '80px' }}
      />
      <AppBar position="fixed" style={{ zIndex: 1300 }}>
        <Toolbar sx={{ height: 60, zIndex: (theme) => theme.zIndex.drawer + 2 }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Dispatcher Dashboard
          </Typography>
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <Button color="inherit" sx={{ fontWeight: 'normal', color: 'inherit' }}>
              Dispatch Sheet
            </Button>
            <Button color="inherit" sx={{ fontWeight: 'normal', color: 'inherit' }}>
              Add Load
            </Button>
            <Button color="inherit" sx={{ fontWeight: 'normal', color: 'inherit' }}>
              Edit Load
            </Button>
            <Button color="inherit" sx={{ fontWeight: 'normal', color: 'inherit' }}>
              Collections
            </Button>
            <IconButton color="inherit">
              <PersonIcon />
            </IconButton>
          </Box>
          {/* Mobile Menu Icon */}
          <Box sx={{ display: { xs: 'block', md: 'none' } }}>
            <IconButton size="large" edge="end" color="inherit">
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <div className="home-container" >
        <main className="content">
          <DispatchSheet />
        </main>
      </div>
    </>
  );
}

export default App;
