import React from 'react';
import { Grid, Card, CardContent, CardActions, Typography, IconButton, Paper } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

const useStyles = {
  card: {
    height: '100%',
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

  return (
    <Grid container spacing={3}>
      {books.map(book => (
        <Grid item key={book.id} xs={12} sm={6} md={4} lg={3}>
          <Card sx={useStyles.card}>
            <CardContent sx={useStyles.bookContent}>
              <Typography gutterBottom variant="h6" component="div" noWrap>
                {book.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                by {book.author}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ISBN: {book.isbn}
              </Typography>
              <Typography variant="h6" sx={useStyles.priceTag}>
                ${parseFloat(book.price).toFixed(2)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Published: {new Date(book.published_date).toLocaleDateString()}
              </Typography>
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
