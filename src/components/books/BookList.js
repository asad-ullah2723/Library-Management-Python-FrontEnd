import React from 'react';
import { Grid, Card, CardContent, CardActions, Typography, IconButton, Paper, Box } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { publicApi } from '../../services/api';

const useStyles = {
  card: {
    height: '100%',
    minHeight: 420,
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: 6,
    },
  },
  bookContent: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  priceTag: {
    color: '#1976d2',
    margin: '8px 0',
  },
  actionArea: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 16px',
  },
};

const BookList = ({ books, handleDelete, canModify = false }) => {
  if (books.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1">No books found. Add a new book to get started!</Typography>
      </Paper>
    );
  }

  const resolveImageUrl = (url) => {
    if (!url) return null;
    // If the backend already returns an absolute URL (http/https), use it.
    if (/^https?:\/\//i.test(url)) return url;
    // Otherwise prefix with the api baseURL (which may be http://localhost:9000 or '/').
    const base = publicApi && publicApi.defaults && publicApi.defaults.baseURL ? publicApi.defaults.baseURL : '';
    // Avoid double slashes when base ends with '/'
    return `${base.replace(/\/$/, '')}/${url.replace(/^\//, '')}`;
  };

  const truncate = (s, n = 20) => {
    const str = s || '';
    return str.length > n ? `${str.slice(0, n)}...` : str;
  };

  return (
  <Grid container spacing={2} alignItems="stretch">
      {books.map(book => (
        // xs=12 (1 per row), sm=6 (2 per row), md=3 (4 per row)
  <Grid item key={book.id} xs={12} sm={6} md={4} lg={3} sx={{ display: 'flex' }}>
          <Card sx={{ ...useStyles.card, width: '100%', boxSizing: 'border-box' }}>
            {book.image_url ? (
              <Box sx={{ height: 180, width: '100%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.100', flexShrink: 0 }}>
                  <Box
                    component="img"
                    src={resolveImageUrl(book.image_url)}
                    alt={book.title}
                    onError={(e) => {
                      // Replace broken images with a data-less placeholder by hiding the element
                      e.currentTarget.style.display = 'none';
                    }}
                    sx={{ width: '100%', height: '100%', objectFit: 'contain', p: 1, bgcolor: 'grey.100' }}
                  />
              </Box>
            ) : (
              <Box sx={{ height: 180, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.100', flexShrink: 0, p: 1 }}>
                <Typography color="text.secondary">No cover</Typography>
              </Box>
            )}
            <CardContent sx={useStyles.bookContent}>
              <Typography gutterBottom variant="h6" component="div" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {truncate(book.title, 20)}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom sx={{ overflow: 'hidden' }}>
                by {truncate(book.author, 20)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                ISBN: {book.isbn}
              </Typography>
              <Box sx={{ mt: 'auto' }}>
                <Typography variant="h6" sx={useStyles.priceTag}>
                  ${parseFloat(book.price).toFixed(2)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Published: {new Date(book.published_date).toLocaleDateString()}
                </Typography>
              </Box>
            </CardContent>
            <CardActions sx={useStyles.actionArea}>
              <div></div> {/* Spacer */}
              {canModify && (
                <IconButton 
                  color="error" 
                  onClick={() => handleDelete(book.id)}
                  aria-label="delete"
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default BookList;
