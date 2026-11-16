import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { products } from '../../data/mockData';

const categories = ['All', 'Pure Water', 'Bottles', 'Packing Bags', 'Shrink Wrapper'];

export default function Products() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  const handleCardClick = (productId, variantId = null) => {
    if (variantId) {
      navigate(`/product/${productId}?variant=${variantId}`);
    } else {
      navigate(`/product/${productId}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Category Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide sticky top-20 z-30 bg-gray-50 py-2">
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

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => {
          
          // LOGIC 1: Split Bottles and Packing Bags into separate cards per size
          if (product.category === 'Bottles' || product.category === 'Packing Bags') {
            return product.variants.map((variant) => (
              <div 
                key={`${product.id}-${variant.id}`} 
                onClick={() => handleCardClick(product.id, variant.id)}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer relative"
              >
                {/* Category Tag (Top Right) */}
                <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-xs font-bold px-3 py-1 rounded-full text-slate-700 shadow-sm z-10">
                  {product.category}
                </span>

                {/* Image */}
                <div className="relative aspect-square bg-gray-50 overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-1">
                  {/* Bold Title (Size + Category Name) */}
                  <h3 className="font-bold text-lg text-gray-900 mb-1">
                    {variant.size} {product.category === 'Bottles' ? 'PET Bottle' : 'Packing Bags'}
                  </h3>
                  
                  {/* Stock Info */}
                  <p className="text-sm text-gray-500 mb-4">
                    {variant.stock} {product.category === 'Packing Bags' ? 'packs' : 'units'} remaining
                  </p>
                  
                  <div className="mt-auto">
                    <button className="w-full py-2.5 rounded-xl font-semibold text-sm bg-slate-900 text-white hover:bg-blue-600 transition-colors">
                      View Details & Order
                    </button>
                  </div>
                </div>
              </div>
            ));
          }

          // LOGIC 2: Pure Water (Single unified card titled "Real Water")
          if (product.category === 'Pure Water') {
            const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
            return (
              <div 
                key={product.id} 
                onClick={() => handleCardClick(product.id)}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer relative"
              >
                <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-xs font-bold px-3 py-1 rounded-full text-slate-700 shadow-sm z-10">
                  Pure Water
                </span>
                <div className="relative aspect-square bg-gray-50 overflow-hidden">
                  <img src={product.image} alt="Real Water" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-bold text-lg text-gray-900 mb-1">Real Water</h3>
                  <p className="text-sm text-gray-500 mb-4">{totalStock} bags remaining</p>
                  <div className="mt-auto">
                    <button className="w-full py-2.5 rounded-xl font-semibold text-sm bg-slate-900 text-white hover:bg-blue-600 transition-colors">
                      View Details & Order
                    </button>
                  </div>
                </div>
              </div>
            );
          }

          // LOGIC 3: Shrink Wrapper (Kept exactly as it was)
          if (product.category === 'Shrink Wrapper') {
            return (
              <div 
                key={product.id} 
                onClick={() => handleCardClick(product.id)}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer relative"
              >
                <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-xs font-bold px-3 py-1 rounded-full text-slate-700 shadow-sm z-10">
                  Shrink Wrapper
                </span>
                <div className="relative aspect-square bg-gray-50 overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-bold text-lg text-gray-900 mb-1">{product.name}</h3>
                  <p className="text-xs text-gray-500 mb-4 line-clamp-2">{product.description}</p>
                  <div className="mt-auto">
                    <button className="w-full py-2.5 rounded-xl font-semibold text-sm bg-slate-900 text-white hover:bg-blue-600 transition-colors">
                      View Weight Options
                    </button>
                  </div>
                </div>
              </div>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}