import orderApi from 'api/order';
import { AutoCompleteField } from 'components/form';
import * as React from 'react';
import { useQuery } from 'react-query';
import { TProductBase } from 'types/product';
import { formatCurrency } from 'utils/utils';

interface Props {
  name: string;
  label?: string;
  [key: string]: any;
}

const AutoCompleteProduct = (props: Props) => {
  const { data: product } = useQuery(['products'], () =>
    orderApi.getPorduct().then((res) => res.data)
  );

  const extraOptions =
    product?.data.map((c: TProductBase) => ({
      label: `${c.product_name} - ${formatCurrency(c.price)}`,
      value: c.product_id
    })) ?? [];

  const getOpObj = (option: any) => {
    if (!option) return option;
    if (!option.value) return extraOptions.find((opt) => opt.value === option);
    return option;
  };

  return (
    <AutoCompleteField
      options={extraOptions}
      getOptionLabel={(value: any) => {
        return getOpObj(value)?.label;
      }}
      isOptionEqualToValue={(option: any, value: any) => {
        if (!option) return option;
        return option.value === getOpObj(value)?.value;
      }}
      transformValue={(opt: any) => opt?.value}
      size="small"
      type="text"
      {...props}
      label={props.label}
      name={props.name}
      fullWidth
    />
  );
};

export default AutoCompleteProduct;
// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
