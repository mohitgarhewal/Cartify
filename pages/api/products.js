import { products } from '@/data/products';

export default function handler(req, res) {
  const { method, query } = req;

  if (method === 'GET') {
    let filteredProducts = [...products];

    // Filter by category
    if (query.category && query.category !== 'all') {
      filteredProducts = filteredProducts.filter(
        (p) => p.category.toLowerCase() === query.category.toLowerCase()
      );
    }

    // Filter by price range
    if (query.minPrice) {
      filteredProducts = filteredProducts.filter(
        (p) => p.price >= parseFloat(query.minPrice)
      );
    }
    if (query.maxPrice) {
      filteredProducts = filteredProducts.filter(
        (p) => p.price <= parseFloat(query.maxPrice)
      );
    }

    // Search by name or description
    if (query.search) {
      const searchTerm = query.search.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm) ||
          p.description.toLowerCase().includes(searchTerm)
      );
    }

    // Sort products
    if (query.sortBy) {
      switch (query.sortBy) {
        case 'price-asc':
          filteredProducts.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          filteredProducts.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          filteredProducts.sort((a, b) => b.rating - a.rating);
          break;
        case 'name':
          filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
          break;
      }
    }

    res.status(200).json({
      success: true,
      count: filteredProducts.length,
      products: filteredProducts,
    });
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
