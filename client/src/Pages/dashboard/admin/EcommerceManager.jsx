import { useState } from 'react';
import { products as initialProducts } from '../../../data/mockData';
import { useSettings } from '../../../context/SettingsContext';

export default function EcommerceManager() {
  const { settings } = useSettings();
  const [products, setProducts] = useState(initialProducts);
  
  // Modal States
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalStep, setModalStep] = useState('select'); // 'select' or 'details'
  const [isNewSize, setIsNewSize] = useState(false);
  
  // Form States
  const [newSizeName, setNewSizeName] = useState('');
  const [addFormData, setAddFormData] = useState({
    weight: '', rollType: 'Single', quantity: ''
  });

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setModalStep('select');
    setIsNewSize(false);
    setNewSizeName('');
    setAddFormData({ weight: '', rollType: 'Single', quantity: '' });
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setModalStep('select');
  };

  // Auto-calculate price based on global settings
  const calculateEstimate = () => {
    if (!selectedProduct) return 0;
    const qty = parseInt(addFormData.quantity) || 0;
    const weight = parseFloat(addFormData.weight) || 0;

    if (selectedProduct.category === 'Shrink Wrapper') {
      return weight * settings.shrinkWrapperPricePerKg;
    }
    if (selectedProduct.category === 'Pure Water') {
      return qty * settings.pureWaterPricePerBag;
    }
    if (selectedProduct.category === 'Bottles') {
      return qty * settings.bottlesPricePerUnit;
    }
    if (selectedProduct.category === 'Packing Bags') {
      return qty * settings.packingBagsPricePerUnit;
    }
    return 0;
  };

  const handleSaveGoods = () => {
    if (!selectedProduct) return;

    // In a real app, this would send data to the backend. 
    // For now, we update the local state to show it working.
    const updatedProducts = products.map(p => {
      if (p.id === selectedProduct.id) {
        if (isNewSize) {
          // Create a brand new variant/size
          const newVariant = {
            id: `v${Date.now()}`,
            size: newSizeName,
            weightKg: selectedProduct.category === 'Shrink Wrapper' ? parseFloat(addFormData.weight) : undefined,
            rollType: selectedProduct.category === 'Shrink Wrapper' ? addFormData.rollType : undefined,
            stock: parseInt(addFormData.quantity) || 1,
            pricePerPack: calculateEstimate()
          };
          return { ...p, variants: [...p.variants, newVariant] };
        } else {
          // Add stock to existing variant
          // (Simplified logic for demo: just adds to the first matching variant)
          return p; 
        }
      }
      return p;
    });

    setProducts(updatedProducts);
    alert(`Successfully added stock to ${isNewSize ? newSizeName : 'existing size'}!`);
    handleCloseModal();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">E-commerce Manager</h1>
        <p className="text-gray-500 text-sm mt-1">Manage stock, prices, and product listings exactly as customers see them.</p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => {
          
          // Bottles & Packing Bags (Separate cards per size)
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
                    <button className="py-2 rounded-lg text-xs font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition">Edit</button>
                    <button onClick={() => handleOpenModal({...product, activeVariant: variant})} className="py-2 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition">Add Goods</button>
                  </div>
                </div>
              </div>
            ));
          }

          // Pure Water
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
                    <button className="py-2 rounded-lg text-xs font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition">Edit</button>
                    <button onClick={() => handleOpenModal(product)} className="py-2 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition">Add Goods</button>
                  </div>
                </div>
              </div>
            );
          }

          // Shrink Wrapper
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
                    <button className="py-2 rounded-lg text-xs font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition">Edit</button>
                    <button onClick={() => handleOpenModal(product)} className="py-2 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition">Add Goods</button>
                  </div>
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>

      {/* ================= MODAL ================= */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-bold text-gray-900">
                {modalStep === 'select' ? 'Select Size' : (isNewSize ? 'Create New Size' : 'Add Stock')}
              </h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" /></svg>
              </button>
            </div>
            
            <div className="p-6">
              {/* STEP 1: SELECT SIZE */}
              {modalStep === 'select' && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 mb-4">Choose an existing size to add stock, or create a new one.</p>
                  
                  {/* Existing Sizes */}
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                    {selectedProduct.variants.map((variant) => {
                      const label = variant.size || variant.name;
                      return (
                        <button
                          key={variant.id}
                          onClick={() => { setIsNewSize(false); setModalStep('details'); }}
                          className="p-3 border border-gray-200 rounded-lg text-sm font-medium hover:bg-blue-50 hover:border-blue-300 transition text-left"
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Create New Size Button */}
                  <button
                    onClick={() => { setIsNewSize(true); setModalStep('details'); }}
                    className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-sm font-semibold text-gray-600 hover:border-blue-500 hover:text-blue-600 transition flex items-center justify-center gap-2"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeLinecap="round" /></svg>
                    Create New Size
                  </button>
                </div>
              )}

              {/* STEP 2: ENTER DETAILS */}
              {modalStep === 'details' && (
                <div className="space-y-4">
                  {/* New Size Name Input */}
                  {isNewSize && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">New Size Name</label>
                      <input 
                        type="text" 
                        value={newSizeName} 
                        onChange={(e) => setNewSizeName(e.target.value)} 
                        placeholder={selectedProduct.category === 'Shrink Wrapper' ? "e.g. 15 x 0.18" : "e.g. 2.8 or 800ml"}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                      />
                    </div>
                  )}

                  {/* Shrink Wrapper Inputs */}
                  {selectedProduct.category === 'Shrink Wrapper' && (
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
                    </>
                  )}

                  {/* Pure Water, Bottles, Packing Bags Inputs */}
                  {(selectedProduct.category === 'Pure Water' || selectedProduct.category === 'Bottles' || selectedProduct.category === 'Packing Bags') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quantity to Add</label>
                      <input type="number" value={addFormData.quantity} onChange={(e) => setAddFormData({...addFormData, quantity: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="How many?" />
                    </div>
                  )}

                  {/* Auto-Calculated Price Display */}
                  <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800 border border-blue-100">
                    Estimated Price per unit: <strong>₦{calculateEstimate().toLocaleString()}</strong> 
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Buttons */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-3">
              {modalStep === 'details' && (
                <button onClick={() => setModalStep('select')} className="flex-1 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-100 text-gray-700">Back</button>
              )}
              <button onClick={handleCloseModal} className="flex-1 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-100 text-gray-700">Cancel</button>
              <button 
                onClick={handleSaveGoods} 
                disabled={modalStep === 'details' && isNewSize && !newSizeName}
                className="flex-1 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {modalStep === 'select' ? 'Next' : 'Save Goods'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
