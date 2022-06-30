import { Grid, Typography } from '@mui/material';
import React, { FC, useContext } from 'react';
import { CartContext } from '../../context';
import { currency } from '../../utils';

interface Props {
  numberOfItemsDb?: number;
  taxDb?: number;
  subTotalDb?: number;
  totalDb?: number;
}

export const OrderSummary: FC<Props> = ({
  numberOfItemsDb,
  taxDb,
  subTotalDb,
  totalDb,
}) => {
  const { numberOfItems, subTotal, total, tax } = useContext(CartContext);

  const taxUI = taxDb ? taxDb : tax;
  const totalUI = totalDb ? totalDb : total;
  const subTotalUI = subTotalDb ? subTotalDb : subTotal;
  const numberOfItemsUI = numberOfItemsDb ? numberOfItemsDb : numberOfItems;

  return (
    <Grid container>
      <Grid item xs={6}>
        <Typography>No. Productos</Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="end">
        <Typography>
          {numberOfItemsUI} {numberOfItemsUI > 1 ? 'productos' : 'producto'}
        </Typography>
      </Grid>

      <Grid item xs={6}>
        <Typography>Subtotal</Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="end">
        <Typography>{currency.format(subTotalUI)}</Typography>
      </Grid>

      <Grid item xs={6}>
        <Typography>
          Impuestos ({Number(process.env.NEXT_PUBLIC_TAX_RATE) * 100})
        </Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="end">
        <Typography>{currency.format(taxUI)}</Typography>
      </Grid>

      <Grid item xs={6} sx={{ mt: 2 }}>
        <Typography variant="subtitle1">Total: </Typography>
      </Grid>
      <Grid item xs={6} sx={{ mt: 2 }} display="flex" justifyContent="end">
        <Typography variant="subtitle1">{currency.format(totalUI)}</Typography>
      </Grid>
    </Grid>
  );
};
