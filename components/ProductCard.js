import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function ProductCard({ product }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="card group"
    >
      <Link href={`/product/${product.slug}`}>
        <div className="relative h-64 bg-gray-200 overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {product.featured && (
            <span className="absolute top-2 right-2 bg-primary-600 text-white text-xs px-2 py-1 rounded">
              Featured
            </span>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-semibold">Out of Stock</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 group-hover:text-primary-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-primary-600">
              ${product.price.toFixed(2)}
            </span>
            <div className="flex items-center text-sm text-gray-600">
              <svg
                className="w-4 h-4 text-yellow-400 fill-current"
                viewBox="0 0 20 20"
              >
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
              <span className="ml-1">{product.rating}</span>
              <span className="ml-1">({product.reviews})</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
