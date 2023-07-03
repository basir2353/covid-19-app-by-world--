import React from 'react';
import { Box } from '@mui/material';

const Item = ({ children, className, onClick }) => {
  return (
    <Box className={className} onClick={onClick} sx={{ backgroundColor: '#fff', padding: '20px', borderRadius: '4px' }}>
      {children}
    </Box>
  );
};

export default Item;
