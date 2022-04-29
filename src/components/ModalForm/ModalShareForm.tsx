import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle
} from '@mui/material';
import useLocales from 'hooks/useLocales';
import React, { ReactNode, useState } from 'react';

interface Props extends Omit<Partial<DialogProps>, 'title'> {
  title: ReactNode;
  trigger: ReactNode;
  onCancle?: () => void;
  onOk: () => Promise<any>;
  children?: ReactNode;
}

const ModalShareForm = ({ trigger, onOk: onSubmit, title, children, ...others }: Props) => {
  const [open, setOpen] = useState(false);
  const { translate } = useLocales();

  return (
    <>
      <span
        onClick={() => {
          console.log(`TRIGGER`);
          setOpen(true);
        }}
      >
        {trigger}
      </span>
      <Dialog fullWidth maxWidth="lg" {...others} open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent dividers>{children}</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} variant="outlined" color="inherit">
            {translate('common.cancel')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ModalShareForm;
