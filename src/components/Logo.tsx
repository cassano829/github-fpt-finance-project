// material
import { Box, BoxProps } from '@mui/material';
import React from 'react';

// ----------------------------------------------------------------------

export default function Logo({ sx }: BoxProps) {
  return <Box component="img" src="/static/reso_logo.png" sx={{ width: 40, height: 40, ...sx }} />;
}
