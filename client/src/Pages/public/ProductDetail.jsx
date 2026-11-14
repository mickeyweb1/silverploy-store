import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { products } from '../../data/mockData';
import { useCart } from '../../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
    const { addToCart } = useCart();
  const navigate = useNavigate();
  
  const product = products.find(p => p.id === parseInt(id));
  const preSelectedVariantId = searchParams.get('variant');

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product) {
      const variant = product.variants.find(v => v.id === preSelectedVariantId) || product.variants[0];
      setSelectedVariant(variant);
    }
  }, [product, preSelectedVariantId]);

  if (!product || !selectedVariant) {
    return <div className="p-8 text-center text-gray-500">Product not found.</div>;
  }

  // Dynamic Price Calculation
  const calculateUnitPrice = () => {
    if (product.category === 'Shrink Wrapper') {
      return selectedVariant.weightKg * product.basePricePerKg;
    }
    return selectedVariant.pricePerPack || selectedVariant.price || 0;
  };

  const unitPrice = calculateUnitPrice();
  const totalPrice = unitPrice * quantity;
  const availableStock = selectedVariant.stock || 0;

  const handleAddToCart = () => {
    if (quantity > availableStock) {
      alert(`Sorry, only ${availableStock} available in stock.`);
      return;
    }
    addToCart(product, selectedVariant, quantity);
    alert('Item added to cart successfully!');
  };

  const variantLabel = product.category === 'Shrink Wrapper' 
    ? `${selectedVariant.weightKg} kg (${selectedVariant.rollType} Roll)` 
    : (selectedVariant.size || selectedVariant.name);

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={() => navigate(-1)} className="mb-4 text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1">
        ← Back to Products
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0">
          <div className="bg-gray-50 p-8 flex items-center justify-center">
            <img src={product.image} alt={product.name} className="max-h-80 w-auto object-contain rounded-xl shadow-md" />
          </div>

          <div className="p-6 md:p-8 flex flex-col">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">{product.category}</span>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-gray-500 mb-6">{product.description}</p>

            {/* Variant Selector */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {product.category === 'Shrink Wrapper' ? 'Available Rolls (by Weight):' : 'Select Size:'}
              </label>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant) => {
                  const label = product.category === 'Shrink Wrapper' 
                    ? `${variant.weightKg} kg (${variant.rollType})` 
                    : (variant.size || variant.name);
                  
                  return (
                    <button
                      key={variant.id}
                      onClick={() => { setSelectedVariant(variant); setQuantity(1); }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                        selectedVariant.id === variant.id
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-slate-400'
                      }`}
                    >
                      {label} {variant.stock === 1 && product.category === 'Shrink Wrapper' ? '(1 left)' : ''}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price & Stock Display */}
            <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-100">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-blue-800">Unit Price:</span>
                <span className="font-semibold text-blue-900">₦{unitPrice.toLocaleString()}</span>
              </div>
              {product.category === 'Shrink Wrapper' && (
                <div className="text-xs text-blue-600 mb-2">
                  (Calculated: {selectedVariant.weightKg}kg × ₦{product.basePricePerKg}/kg)
                </div>
              )}
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-blue-200">
                <span className="text-sm text-blue-800">Available Stock:</span>
                <span className={`font-bold ${availableStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {availableStock} unit(s)
                </span>
              </div>
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-blue-200">
                <span className="text-lg font-bold text-blue-900">Total Estimate:</span>
                <span className="text-2xl font-bold text-blue-700">₦{totalPrice.toLocaleString()}</span>
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="mt-auto space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-sm font-semibold text-gray-700">Quantity:</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-l-lg"
                  >-</button>
                  <span className="px-4 py-2 font-semibold text-gray-900 min-w-[3rem] text-center">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(q => Math.min(availableStock, q + 1))}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-r-lg"
                  >+</button>
                </div>
              </div>

              <button 
                onClick={handleAddToCart}
                disabled={availableStock === 0}
                className={`w-full py-3.5 rounded-xl font-bold text-lg transition-all shadow-lg ${
                  availableStock === 0 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' 
                    : 'bg-slate-900 text-white hover:bg-blue-600 active:scale-[0.98] shadow-blue-900/20'
                }`}
              >
                {availableStock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}