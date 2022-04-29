import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogContent, DialogProps, DialogTitle, IconButton } from '@mui/material';
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
          setOpen(true);
        }}
      >
        {trigger}
      </span>
      <Dialog fullWidth maxWidth="lg" {...others} open={open} onClose={() => setOpen(false)}>
        <DialogTitle>
          {title}
          <IconButton
            aria-label="close"
            onClick={() => setOpen(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500]
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>{children}</DialogContent>
      </Dialog>
    </>
  );
};

export default ModalShareForm;
