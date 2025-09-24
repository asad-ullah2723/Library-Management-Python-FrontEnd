import React, { useEffect, useState, useRef } from 'react';
import { Box, IconButton } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';

const images = [
  '/slider1.webp',
//   '/slider2.jpg',
//   '/slider3.jpg',
  '/slider4.avif',
  '/slider5.jpg',
];

const ImageSlider = ({ interval = 4000 }) => {
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    start();
    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const start = () => {
    stop();
    timerRef.current = setInterval(() => {
      setIndex(i => (i + 1) % images.length);
    }, interval);
  };

  const stop = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const prev = () => {
    stop();
    setIndex(i => (i - 1 + images.length) % images.length);
    start();
  };

  const next = () => {
    stop();
    setIndex(i => (i + 1) % images.length);
    start();
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', height: { xs: 220, sm: 340, md: 820 }, overflow: 'hidden', bgcolor: 'transparent' }}>
      {images.map((src, i) => (
        <Box
          component="img"
          key={src}
          src={src}
          alt={`slide-${i}`}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'opacity 600ms ease',
            opacity: i === index ? 1 : 0,
          }}
        />
      ))}

      {/* controls */}
      <IconButton onClick={prev} size="small" sx={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(0,0,0,0.3)', color: 'white', '&:hover': { bgcolor: 'rgba(0,0,0,0.45)' } }}>
        <ArrowBackIos fontSize="small" />
      </IconButton>
      <IconButton onClick={next} size="small" sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(0,0,0,0.3)', color: 'white', '&:hover': { bgcolor: 'rgba(0,0,0,0.45)' } }}>
        <ArrowForwardIos fontSize="small" />
      </IconButton>
    </Box>
  );
};

export default ImageSlider;
