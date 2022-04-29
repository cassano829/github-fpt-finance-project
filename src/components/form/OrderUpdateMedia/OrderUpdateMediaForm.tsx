import { Box, Grid } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { AutoCompleteField, InputField } from '..';

interface Props {
  tags?: [];
}

const OrderUpdateMediaForm = ({ tags }: Props) => {
  const { watch } = useFormContext();
  const picUrl = watch('pic_url');
  return (
    <Grid container spacing={2} sx={{ alignItems: 'start' }}>
      <InputField name="id" sx={{ display: 'none' }} />
      <InputField type="text" size="small" fullWidth name="pic_url" sx={{ display: 'none' }} />

      <Grid item xs={6}>
        <Box
          component="img"
          src={picUrl}
          sx={{ width: '100%', height: 'auto', maxHeight: '200px', objectFit: 'cover' }}
        />
      </Grid>
      <Grid item container xs={6} spacing={2}>
        <Grid item xs={10}>
          <InputField type="text" size="small" fullWidth name="title" label="Tiêu đề" />
        </Grid>
        {/* <Grid item xs={6}>
          <InputField type="text" size="small" fullWidth name="created_at" label="Ngày tạo" />
        </Grid> */}
        <Grid item xs={10}>
          <AutoCompleteField
            name="tags"
            label="Tag"
            multiple
            freeSolo
            size="small"
            variant="outlined"
            options={[]}
            limitTags={1}
            fullWidth
          />
        </Grid>
        {/* <Grid item xs={6}>
          <DatePickerField type="text" size="small" fullWidth name="timestamp" label="Ngày chụp" />
        </Grid> */}
      </Grid>
    </Grid>
  );
};

export default OrderUpdateMediaForm;
