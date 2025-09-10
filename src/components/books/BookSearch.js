import React from 'react';
import { TextField, Button, Box } from '@mui/material';
import { Search as SearchIcon, Refresh as RefreshIcon } from '@mui/icons-material';

const BookSearch = ({ 
  searchTitle, 
  setSearchTitle, 
  searchAuthor, 
  setSearchAuthor, 
  minPrice, 
  setMinPrice, 
  maxPrice, 
  setMaxPrice, 
  handleSearch, 
  fetchBooks 
}) => {
  return (
    <>
      <Box sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' },
        mb: 2
      }}>
        <TextField
          label="Title"
          variant="outlined"
          value={searchTitle}
          onChange={e => setSearchTitle(e.target.value)}
          fullWidth
        />
        <TextField
          label="Author"
          variant="outlined"
          value={searchAuthor}
          onChange={e => setSearchAuthor(e.target.value)}
          fullWidth
        />
        <TextField
          type="number"
          label="Min Price"
          variant="outlined"
          value={minPrice}
          onChange={e => setMinPrice(e.target.value)}
          inputProps={{ step: '0.01', min: '0' }}
          fullWidth
        />
        <TextField
          type="number"
          label="Max Price"
          variant="outlined"
          value={maxPrice}
          onChange={e => setMaxPrice(e.target.value)}
          inputProps={{ step: '0.01', min: '0' }}
          fullWidth
        />
      </Box>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSearch}
          startIcon={<SearchIcon />}
        >
          Search
        </Button>
        <Button 
          variant="outlined" 
          color="primary" 
          onClick={fetchBooks}
          startIcon={<RefreshIcon />}
        >
          Reset
        </Button>
      </Box>
    </>
  );
};

export default BookSearch;
