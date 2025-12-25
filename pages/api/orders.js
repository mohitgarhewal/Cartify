export default function handler(req, res) {
  const { method, body } = req;

  if (method === 'POST') {
    // Mock order creation
    const { items, shippingAddress, paymentMethod, total } = body;

    if (!items || !shippingAddress || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    // Simulate order creation
    const order = {
      orderId: `ORD-${Date.now()}`,
      items,
      shippingAddress,
      paymentMethod,
      total,
      status: 'processing',
      createdAt: new Date().toISOString(),
    };

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order,
    });
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
