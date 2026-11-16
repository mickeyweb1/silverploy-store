import { useState } from 'react';
import { products as initialProducts } from '../../../data/mockData';
import { useSettings } from '../../../context/SettingsContext';

export default function EcommerceManager() {
  const { settings } = useSettings();
  const [products, setProducts] = useState(initialProducts);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalType, setModalType] = useState(null); // 'edit' or 'add'
  
  // Form states for "Add Goods"
  const [addFormData, setAddFormData] = useState({
    weight: '', rollType: 'Single', quantity: '', newSize: ''
  });

  const handleOpenModal = (product, type) => {
    setSelectedProduct(product);
    setModalType(type);
    setAddFormData({ weight: '', rollType: 'Single', quantity: '', newSize: '' });
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setModalType(null);
  };

  // Calculate estimated price for the "Add Goods" modal
  const calculateEstimate = () => {
    if (!selectedProduct) return 0;
    if (selectedProduct.category === 'Shrink Wrapper') {
      return (parseFloat(addFormData.weight) || 0) * settings.shrinkWrapperPricePerKg;
    }
    if (selectedProduct.category === 'Pure Water') {
      return (parseInt(addFormData.quantity) || 0) * settings.pureWaterPricePerBag;
    }
    if (selectedProduct.category === 'Bottles' || selectedProduct.category === 'Packing Bags') {
      return (parseInt(addFormData.quantity) || 0) * settings[
        selectedProduct.category === 'Bottles' ? 'bottlesPricePerUnit' : 'packingBagsPricePerUnit'
      ];
    }
    return 0;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">E-commerce Manager</h1>
        <p className="text-gray-500 text-sm mt-1">Manage stock, prices, and product listings exactly as customers see them.</p>
      </div>

      {/* Product Grid (Duplicate of Public Website) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => {
          
          // Split Bottles and Packing Bags into separate cards
          if (product.category === 'Bottles' || product.category === 'Packing Bags') {
            return product.variants.map((variant) => (
              <div key={`${product.id}-${variant.id}`} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col relative">
                <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-xs font-bold px-3 py-1 rounded-full text-slate-700 shadow-sm z-10">
                  {product.category}
                </span>
                <div className="relative aspect-square bg-gray-50 overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-bold text-lg text-gray-900 mb-1">
                    {variant.size} {product.category === 'Bottles' ? 'PET Bottle' : 'Packing Bags'}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">{variant.stock} units remaining</p>
                  <div className="mt-auto grid grid-cols-2 gap-2">
                    <button onClick={() => handleOpenModal({...product, variant}, 'edit')} className="py-2 rounded-lg text-xs font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition">Edit</button>
                    <button onClick={() => handleOpenModal({...product, variant}, 'add')} className="py-2 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition">Add Goods</button>
                  </div>
                </div>
              </div>
            ));
          }

          // Pure Water Card
          if (product.category === 'Pure Water') {
            const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
            return (
              <div key={product.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col relative">
                <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-xs font-bold px-3 py-1 rounded-full text-slate-700 shadow-sm z-10">Pure Water</span>
                <div className="relative aspect-square bg-gray-50 overflow-hidden">
                  <img src={product.image} alt="Real Water" className="w-full h-full object-cover" />
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-bold text-lg text-gray-900 mb-1">Real Water</h3>
                  <p className="text-sm text-gray-500 mb-4">{totalStock} bags remaining</p>
                  <div className="mt-auto grid grid-cols-2 gap-2">
                    <button onClick={() => handleOpenModal(product, 'edit')} className="py-2 rounded-lg text-xs font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition">Edit</button>
                    <button onClick={() => handleOpenModal(product, 'add')} className="py-2 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition">Add Goods</button>
                  </div>
                </div>
              </div>
            );
          }

          // Shrink Wrapper Card
          if (product.category === 'Shrink Wrapper') {
            return (
              <div key={product.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col relative">
                <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-xs font-bold px-3 py-1 rounded-full text-slate-700 shadow-sm z-10">Shrink Wrapper</span>
                <div className="relative aspect-square bg-gray-50 overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-bold text-lg text-gray-900 mb-1">{product.name}</h3>
                  <p className="text-xs text-gray-500 mb-4">{product.variants.length} roll(s) in stock</p>
                  <div className="mt-auto grid grid-cols-2 gap-2">
                    <button onClick={() => handleOpenModal(product, 'edit')} className="py-2 rounded-lg text-xs font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition">Edit</button>
                    <button onClick={() => handleOpenModal(product, 'add')} className="py-2 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition">Add Goods</button>
                  </div>
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>

      {/* Simple Modal Placeholder (We will build the full forms next) */}
      {modalType && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {modalType === 'edit' ? 'Edit' : 'Add Goods to'} {selectedProduct.name || 'Product'}
            </h2>
            
            {/* Dynamic Form based on Category */}
            <div className="space-y-4">
              {selectedProduct.category === 'Shrink Wrapper' && modalType === 'add' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Weight (KG)</label>
                    <input type="number" value={addFormData.weight} onChange={(e) => setAddFormData({...addFormData, weight: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="e.g. 20.8" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Roll Type</label>
                    <select value={addFormData.rollType} onChange={(e) => setAddFormData({...addFormData, rollType: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option>Single</option>
                      <option>Double</option>
                    </select>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800">
                    Estimated Price: <strong>₦{calculateEstimate().toLocaleString()}</strong> 
                    <span className="block text-xs mt-1">({addFormData.weight || 0}kg × ₦{settings.shrinkWrapperPricePerKg}/kg)</span>
                  </div>
                </>
              )}

              {selectedProduct.category === 'Pure Water' && modalType === 'add' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">How many bags?</label>
                    <input type="number" value={addFormData.quantity} onChange={(e) => setAddFormData({...addFormData, quantity: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800">
                    Estimated Total: <strong>₦{calculateEstimate().toLocaleString()}</strong>
                  </div>
                </>
              )}

              {(selectedProduct.category === 'Bottles' || selectedProduct.category === 'Packing Bags') && modalType === 'add' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity to Add</label>
                    <input type="number" value={addFormData.quantity} onChange={(e) => setAddFormData({...addFormData, quantity: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800">
                    Estimated Total: <strong>₦{calculateEstimate().toLocaleString()}</strong>
                  </div>
                </>
              )}

              {modalType === 'edit' && (
                <p className="text-gray-500 text-sm">Edit form fields will go here (Name, Base Price, etc).</p>
              )}
            </div>

            <div className="mt-6 flex gap-3">
              <button onClick={handleCloseModal} className="flex-1 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50">Cancel</button>
              <button onClick={handleCloseModal} className="flex-1 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-blue-600">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}