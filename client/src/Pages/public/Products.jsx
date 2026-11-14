import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { products } from '../../data/mockData';

const categories = ['All', 'Pure Water', 'Bottles', 'Packing Bags', 'Shrink Wrapper'];

export default function Products() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');

  // Filter products based on selected category
  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  const handleCardClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleVariantClick = (productId, variantId, e) => {
    e.stopPropagation(); // Prevent triggering the card click
    navigate(`/product/${productId}?variant=${variantId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Our Products</h1>
          <p className="text-gray-500 text-sm mt-1">Select a product or size to view pricing and order.</p>
        </div>
      </div>

      {/* Category Filter Tabs (NOW WORKING) */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
              activeCategory === cat 
                ? 'bg-slate-900 text-white shadow-md' 
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div 
            key={product.id} 
            className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
          >
            <div 
              className="relative aspect-square bg-gray-50 overflow-hidden cursor-pointer"
              onClick={() => handleCardClick(product.id)}
            >
              <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-bold px-3 py-1 rounded-full text-slate-700 shadow-sm">
                {product.category}
              </span>
            </div>

            <div className="p-4 flex flex-col flex-1">
              <h3 className="font-bold text-lg text-gray-900 mb-1">{product.name}</h3>
              <p className="text-xs text-gray-500 mb-4 line-clamp-2">{product.description}</p>
              
              <div className="mt-auto space-y-3">
                {product.category === 'Shrink Wrapper' ? (
                  <button
                    onClick={() => handleCardClick(product.id)}
                    className="w-full py-2.5 rounded-xl font-semibold text-sm bg-slate-900 text-white hover:bg-blue-600 transition-colors"
                  >
                    View Available Rolls (by Weight)
                  </button>
                ) : (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Available Sizes:</p>
                    <div className="flex flex-wrap gap-2">
                      {product.variants.map((variant) => {
                        const label = variant.size || variant.name;
                        return (
                          <button
                            key={variant.id}
                            onClick={(e) => handleVariantClick(product.id, variant.id, e)}
                            className="text-xs font-medium px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-600 hover:text-white transition-colors"
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
