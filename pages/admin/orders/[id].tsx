import { GetServerSideProps, NextPage } from 'next';
import {
  AirplaneTicketOutlined,
  CreditCardOffOutlined,
  CreditScoreOutlined,
} from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Typography,
} from '@mui/material';

import { CartList, OrderSummary } from '../../../components/cart';
import { AdminLayout } from '../../../components/layouts';
import { dbOrders } from '../../../database';
import { IOrder } from '../../../interfaces';
import { useRouter } from 'next/router';
import { useState } from 'react';

export type OrderResponseBody = {
  id: string;
  status:
    | 'COMPLETED'
    | 'SAVED'
    | 'APPROVED'
    | 'VOIDED'
    | 'PAYER_ACTION_REQUIRED';
};

interface Props {
  order: IOrder;
}

const OrderPage: NextPage<Props> = ({ order }) => {
  const [isPaying, setIsPaying] = useState(false);
  const router = useRouter();
  const {
    numberOfItems,
    tax,
    subTotal,
    total,
    shippingAddress: {
      firstName,
      lastName,
      address,
      address2,
      city,
      zip,
      country,
      phone,
    },
  } = order;

  return (
    <AdminLayout
      title="Resumen de la orden 12345678"
      subTitle={`OrdernId: ${order._id}`}
      icon={<AirplaneTicketOutlined />}
    >
      {order.isPaid ? (
        <Chip
          sx={{ my: 2 }}
          label="Orden ya fue pagada"
          variant="outlined"
          color="success"
          icon={<CreditScoreOutlined />}
        />
      ) : (
        <Chip
          sx={{ my: 2 }}
          label="Pendiente de pago"
          variant="outlined"
          color="error"
          icon={<CreditCardOffOutlined />}
        />
      )}

      <Grid container className="fadeIn">
        <Grid item xs={12} sm={7}>
          <CartList products={order.orderItems} />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Card className="summary-card">
            <CardContent>
              <Typography variant="h2">
                Resumen ({order.numberOfItems}{' '}
                {order.numberOfItems > 1 ? 'producto' : 'productos'})
              </Typography>
              <Divider sx={{ my: 1 }} />

              <Typography variant="subtitle1">Direccion de entrega</Typography>
              <Typography>
                {firstName} {lastName}
              </Typography>
              <Typography>
                {address}
                {address2 ? `, ${address2}` : ''}
              </Typography>
              <Typography>
                {city} {zip}
              </Typography>
              <Typography>{country}</Typography>
              <Typography>{phone}</Typography>

              <Divider sx={{ my: 1 }} />

              <OrderSummary
                numberOfItemsDb={numberOfItems}
                taxDb={tax}
                subTotalDb={subTotal}
                totalDb={total}
              />

              <Box sx={{ mt: 3 }} display="flex" flexDirection="column">
                <Box
                  display="flex"
                  justifyContent="center"
                  className="fadeIn"
                  sx={{ display: isPaying ? 'flex' : 'none' }}
                >
                  <CircularProgress />
                </Box>

                <Box
                  sx={{ display: isPaying ? 'none' : 'flex', flex: 1 }}
                  flexDirection="column"
                >
                  {order.isPaid ? (
                    <Chip
                      sx={{ my: 2 }}
                      label="Orden ya fue pagada"
                      variant="outlined"
                      color="success"
                      icon={<CreditScoreOutlined />}
                    />
                  ) : (
                    <Chip
                      sx={{ my: 2 }}
                      label="Pendiente de pago"
                      variant="outlined"
                      color="error"
                      icon={<CreditCardOffOutlined />}
                    />
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  const { id = '' } = query;
  // const session: any = await getSession({ req });

  // if (!session) {
  //   return {
  //     redirect: {
  //       destination: `/auth/login?p=/orders/${id}`,
  //       permanent: false,
  //     },
  //   };
  // }

  const order = await dbOrders.getOrderById(id.toString());
  if (!order) {
    return {
      redirect: {
        destination: `/admin/orders`,
        permanent: false,
      },
    };
  }

  // if (order.user !== session.user._id) {
  //   return {
  //     redirect: {
  //       destination: `/orders/history`,
  //       permanent: false,
  //     },
  //   };
  // }

  return {
    props: {
      order,
    },
  };
};

export default OrderPage;
