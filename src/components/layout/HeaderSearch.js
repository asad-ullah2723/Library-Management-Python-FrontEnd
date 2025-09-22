import React, { useState } from 'react';
import { Box, InputBase, IconButton, Paper } from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';

// Simple header search component (search by title or author)
const HeaderSearch = ({ onSearch }) => {
  const [q, setQ] = useState('');

  const submit = (e) => {
    e && e.preventDefault();
    if (onSearch) onSearch(q.trim());
  };

  return (
    <Box component="form" onSubmit={submit} sx={{ mx: 2, width: { xs: '60%', sm: '50%', md: '40%' } }}>
      <Paper
        component="div"
        sx={{ display: 'flex', alignItems: 'center', p: '0px 8px', borderRadius: 2 }}
        elevation={1}
      >
        <InputBase
          placeholder="Search by title or author..."
          inputProps={{ 'aria-label': 'search books' }}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          sx={{ ml: 1, flex: 1 }}
        />
        {q ? (
          <IconButton size="small" onClick={() => setQ('')} aria-label="clear search">
            <ClearIcon fontSize="small" />
          </IconButton>
        ) : null}
        <IconButton type="submit" sx={{ p: '6px' }} aria-label="search">
          <SearchIcon />
        </IconButton>
      </Paper>
    </Box>
  );
};

export default HeaderSearch;
