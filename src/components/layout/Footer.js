import React from 'react';
import { Box, Container, Typography, Link, IconButton } from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn, Email } from '@mui/icons-material';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <Box component="footer" sx={{ bgcolor: 'primary.dark', color: 'primary.contrastText', mt: 6, py: { xs: 4, sm: 6 } }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              LibroMatrix
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, maxWidth: 520 }}>
              A lightweight library management front-end for small libraries. Manage books, transactions, reservations and users with an intuitive interface.
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
              © {year} LibroMatrix. All rights reserved.
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', sm: 'flex-end' } }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <IconButton size="small" component={Link} href="#" sx={{ color: 'inherit' }} aria-label="facebook">
                <Facebook fontSize="small" />
              </IconButton>
              <IconButton size="small" component={Link} href="#" sx={{ color: 'inherit' }} aria-label="twitter">
                <Twitter fontSize="small" />
              </IconButton>
              <IconButton size="small" component={Link} href="#" sx={{ color: 'inherit' }} aria-label="instagram">
                <Instagram fontSize="small" />
              </IconButton>
              <IconButton size="small" component={Link} href="#" sx={{ color: 'inherit' }} aria-label="linkedin">
                <LinkedIn fontSize="small" />
              </IconButton>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Link href="mailto:contact@libromatrix.example" color="inherit" underline="hover" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Email fontSize="small" />
                <Typography variant="body2">contact@libromatrix.example</Typography>
              </Link>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
