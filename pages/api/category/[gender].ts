import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../database';
import { IProduct } from '../../../interfaces';
import { Product } from '../../../models';

type Data =
  | {
      message: string;
    }
  | IProduct[];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case 'GET':
      return getProductByGender(req, res);
    default:
      return res.status(400).json({
        message: 'Product not found',
      });
  }
}

const getProductByGender = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  console.log(req.query.slug);
  const { gender } = req.query;

  await db.connect();
  const product = await Product.find({ gender })
    // .select('title images price inStock slug -_id')
    .lean();
  await db.disconnect();

  if (!product) {
    return res.status(404).json({
      message: 'Producto no encontrado',
    });
  }

  return res.status(200).json(product);
};
