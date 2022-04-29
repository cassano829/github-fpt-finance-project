import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import Slide from '@mui/material/Slide';
import React, { forwardRef, useMemo, useState } from 'react';
import { TStore } from 'types/store';
import { TransitionProps } from '@mui/material/transitions';
import ArrowForward from '@mui/icons-material/ArrowForward';
import CloseIcon from '@mui/icons-material/Close';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import { chunk } from 'lodash';
import { useDebounceFn } from 'ahooks';

const Transition = forwardRef(
  (
    props: TransitionProps & {
      children?: React.ReactElement;
    },
    ref: React.Ref<unknown>
  ) => <Slide direction="up" ref={ref} {...(props as any)} />
);

type Props = {
  open: boolean;
  onClose: () => void;
  onSelectStore: (store: TStore) => void;
};

const StoreNavigationDialog: React.FC<Props> = ({ open, onClose, onSelectStore }) => {
  const { stores = [] } = useSelector((state: RootState) => state.admin);
  const [filterName, setFilterName] = useState<string | null>(null);

  const { run } = useDebounceFn(
    (values) => {
      setFilterName(values);
    },
    {
      wait: 500
    }
  );

  const filteredStores = useMemo(() => {
    const groupStores: any[] = chunk(stores, 5);

    if (!filterName) return groupStores;

    groupStores.forEach((groupStore: TStore[], index) => {
      groupStores[index] = groupStore.filter(({ name }) =>
        name.toLowerCase().includes(filterName.toLowerCase())
      );
    });
    return groupStores;
  }, [filterName, stores]);

  return (
    <Dialog
      fullWidth
      maxWidth="lg"
      TransitionComponent={Transition}
      open={open}
      onClose={onClose}
      scroll="paper"
    >
      <DialogTitle>
        Danh sách cửa hàng
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500]
          }}
          size="large"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Box p={2}>
        <TextField
          onChange={(e) => {
            run(e.target.value);
          }}
          placeholder="Tên cửa hàng..."
          variant="outlined"
          size="small"
        />
      </Box>
      <DialogContent dividers>
        {filteredStores.map(
          (groupStore: TStore[], index) =>
            !!groupStore.length && (
              <Box key={`group${index}`} mb={2}>
                <Typography variant="h6">Nhóm {index + 1}</Typography>
                <Grid mt={1} container spacing={2} sx={{ width: '100%' }}>
                  {groupStore.map((store: TStore, index) => (
                    <Grid key={`item ${index}`} item xs={12} sm={6} md={4} lg={3}>
                      <Card>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Box width="60%">
                            <Typography variant="caption">{store.store_code ?? '-'}</Typography>
                            <Typography variant="subtitle1" noWrap>
                              {store.name}
                            </Typography>
                          </Box>
                          <Fab
                            onClick={() => {
                              onSelectStore(store);
                            }}
                            color="primary"
                            aria-label="add"
                          >
                            <ArrowForward />
                          </Fab>
                        </Stack>
                        <Stack
                          mt={2}
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Box>
                            <Typography variant="caption">Địa chỉ</Typography>
                            <Typography variant="body1" noWrap>
                              QUận 1 123132
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption">Người quản lý</Typography>
                            <Typography variant="body1" noWrap>
                              A Nhân
                            </Typography>
                          </Box>
                        </Stack>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Quay lại</Button>
      </DialogActions>
    </Dialog>
  );
};

export default StoreNavigationDialog;
