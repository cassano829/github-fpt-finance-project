import { TProductMaster } from 'types/product';
import { UpdateProductForm } from './type';

export const transformProductForm = (values: UpdateProductForm) => {
  const transformData = { ...values };
  transformData.atts = values.variants?.map(({ optName }) => optName);
  if (transformData.product_type) {
    const variantArr = values.variants?.reduce<any>((acc, { values = [] }) => [...acc, values], []);
    // transformData.child_products = getCbn(...variantArr)?.map((arr) => ({
    //   atts: arr,
    //   is_available: true,
    //   code: `${transformData.code}${arr.join('')}`,
    //   product_name: `${transformData.product_name}-${arr.join('-')}`
    // }));
  }
  return transformData;
};

export const transformProductData = (values: TProductMaster) => {
  const transformData: Partial<UpdateProductForm> = { ...values };
  transformData.variants =
    transformData.atts?.map((att) => ({
      optName: att,
      values: []
    })) ?? [];

  // transformData
  transformData.child_products?.forEach((childProd) => {
    if (childProd?.atts) {
      for (let index = 0; index < childProd?.atts?.length; index++) {
        const att = childProd.atts[index];
        const opt = transformData?.variants && transformData?.variants[index];
        if (!opt?.values.includes(att) && opt?.values) {
          opt.values.push(att);
        }
      }
    }
  });

  return transformData;
};
