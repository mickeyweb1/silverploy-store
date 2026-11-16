import { useState } from 'react';
import { products as initialProducts } from '../../../data/mockData';
import { useSettings } from '../../../context/SettingsContext';

export default function EcommerceManager() {
  const { settings } = useSettings();
  const [products, setProducts] = useState(initialProducts);
  
  // State for existing product modals (Edit / Add Stock)
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalType, setModalType] = useState(null); 
  
  // State for the NEW "Add New Product/Size" modal
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    category: 'Shrink Wrapper',
    name: '', // e.g., "15 x 0.11" or "800ml"
    stock: '',
    weight: '',
    rollType: 'Single'
  });

  const handleOpenModal = (product, type) => {
    setSelectedProduct(product);
    setModalType(type);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setModalType(null);
  };

  // Handle adding a completely NEW product/size
  const handleAddNewItem = (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.stock) return;

    const newId = Math.max(...products.map(p => p.id)) + 1;
    const baseImage = 'https://placehold.co/400x400/e0f2fe/0369a1?text=New+Item';

    if (newItem.category === 'Pure Water') {
      // Just add stock to the existing Real Water card
      setProducts(products.map(p => 
        p.category === 'Pure Water' 
          ? { ...p, variants: p.variants.map(v => ({ ...v, stock: v.stock + parseInt(newItem.stock) })) }
          : p
      ));
    } else {
      // Create a brand new card for Bottles, Packing Bags, or Shrink Wrappers
      const newProduct = {
        id: newId,
        category: newItem.category,
        name: newItem.name,
        description: `New ${newItem.category} item.`,
        image: baseImage,
        basePricePerKg: newItem.category === 'Shrink Wrapper' ? settings.shrinkWrapperPricePerKg : 0,
        variants: [
          { 
            id: 'v1', 
            size: newItem.category === 'Bottles' || newItem.category === 'Packing Bags' ? newItem.name : undefined,
            rollType: newItem.category === 'Shrink Wrapper' ? newItem.rollType : undefined,
            weightKg: newItem.category === 'Shrink Wrapper' ? parseFloat(newItem.weight) : undefined,
            stock: parseInt(newItem.stock),
            pricePerPack: newItem.category === 'Bottles' || newItem.category === 'Packing Bags' ? settings[newItem.category === 'Bottles' ? 'bottlesPricePerUnit' : 'packingBagsPricePerUnit'] : undefined
          }
        ]
      };
      setProducts([...products, newProduct]);
    }

    setIsNewModalOpen(false);
    setNewItem({ category: 'Shrink Wrapper', name: '', stock: '', weight: '', rollType: 'Single' });
  };

  return (
    <div className="space-y-6">
      {/* Header with New Product Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">E-commerce Manager</h1>
          <p className="text-gray-500 text-sm mt-1">Manage stock, prices, and product listings.</p>
        </div>
        <button 
          onClick={() => setIsNewModalOpen(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition flex items-center gap-2 shadow-sm"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeLinecap="round" /></svg>
          Add New Product / Size
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => {
          
          if (product.category === 'Bottles' || product.category === 'Packing Bags') {
            return product.variants.map((variant) => (
              <div key={`${product.id}-${variant.id}`} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col relative">
                <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-xs font-bold px-3 py-1 rounded-full text-slate-700 shadow-sm z-10">{product.category}</span>
                <div className="relative aspect-square bg-gray-50 overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-bold text-lg text-gray-900 mb-1">{variant.size} {product.category === 'Bottles' ? 'PET Bottle' : 'Packing Bags'}</h3>
                  <p className="text-sm text-gray-500 mb-4">{variant.stock} units remaining</p>
                  <div className="mt-auto grid grid-cols-2 gap-2">
                    <button onClick={() => handleOpenModal({...product, variant}, 'edit')} className="py-2 rounded-lg text-xs font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition">Edit</button>
                    <button onClick={() => handleOpenModal({...product, variant}, 'add')} className="py-2 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition">Add Goods</button>
                  </div>
                </div>
              </div>
            ));
          }

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

      {/* ================= "ADD NEW PRODUCT / SIZE" MODAL ================= */}
      {isNewModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Product or Size</h2>
            
            <form onSubmit={handleAddNewItem} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select 
                  value={newItem.category} 
                  onChange={(e) => setNewItem({...newItem, category: e.target.value})} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="Shrink Wrapper">Shrink Wrapper</option>
                  <option value="Bottles">Bottles</option>
                  <option value="Packing Bags">Packing Bags</option>
                  <option value="Pure Water">Pure Water (Real Water)</option>
                </select>
              </div>

              {newItem.category !== 'Pure Water' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {newItem.category === 'Shrink Wrapper' ? 'Size (e.g., 15 x 0.11)' : 'Size (e.g., 800ml or 4.0)'}
                  </label>
                  <input 
                    type="text" 
                    value={newItem.name} 
                    onChange={(e) => setNewItem({...newItem, name: e.target.value})} 
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                    placeholder={newItem.category === 'Shrink Wrapper' ? '15 x 0.11' : '800ml'}
                  />
                </div>
              )}

              {newItem.category === 'Shrink Wrapper' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Weight (KG)</label>
                      <input type="number" step="0.1" value={newItem.weight} onChange={(e) => setNewItem({...newItem, weight: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="20.8" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Roll Type</label>
                      <select value={newItem.rollType} onChange={(e) => setNewItem({...newItem, rollType: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                        <option>Single</option>
                        <option>Double</option>
                      </select>
                    </div>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800">
                    Price will auto-calculate: <strong>₦{(parseFloat(newItem.weight || 0) * settings.shrinkWrapperPricePerKg).toLocaleString()}</strong>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Initial Stock Quantity</label>
                <input 
                  type="number" 
                  value={newItem.stock} 
                  onChange={(e) => setNewItem({...newItem, stock: e.target.value})} 
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                  placeholder="How many?"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsNewModalOpen(false)} className="flex-1 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700">Create New Item</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
