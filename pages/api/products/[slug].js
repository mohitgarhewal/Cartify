import { products } from '@/data/products';

export default function handler(req, res) {
  const { slug } = req.query;

  if (req.method === 'GET') {
    const product = products.find((p) => p.slug === slug);

    if (product) {
      res.status(200).json({
        success: true,
        product,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
