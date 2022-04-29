import { Card as MuiCard, Typography } from '@mui/material';
import { styled } from '@mui/material';

export const StickyCard = styled(MuiCard)({
  textAlign: 'left',
  padding: '1em',
  marginBottom: '1em',
  minHeight: '80px'
  // left: 0
});

export const Card = styled(MuiCard)({
  textAlign: 'left',
  padding: '1em',
  marginBottom: '1em'
});

export const CardTitle = styled(Typography)({
  borderBottom: '1px solid',
  borderColor: 'gray',
  display: 'inline-block',
  paddingBottom: '0.25rem',
  marginBottom: '1rem',
  textAlign: 'left'
});
