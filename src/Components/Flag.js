import React from 'react';

const Flag = ({ src, alt }) => {
  return <img src={src} alt={alt} style={{ width: '50px', height: 'auto' }} />;
};

export default Flag;
