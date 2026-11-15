import { useSettings } from '../../../context/SettingsContext';

export default function Settings() {
  const { settings, updateSetting } = useSettings();

  const pricingCards = [
    { 
      id: 'shrinkWrapperPricePerKg', 
      title: 'Shrink Wrapper', 
      desc: 'Set the base price per Kilogram (KG).', 
      unit: '₦ / KG',
      color: 'border-l-gray-600'
    },
    { 
      id: 'pureWaterPricePerBag', 
      title: 'Pure Water (Real Water)', 
      desc: 'Set the price per standard bag/pack.', 
      unit: '₦ / Bag',
      color: 'border-l-blue-600'
    },
    { 
      id: 'packingBagsPricePerUnit', 
      title: 'Packing Bags', 
      desc: 'Set the base price per single unit/bag.', 
      unit: '₦ / Unit',
      color: 'border-l-yellow-600'
    },
    { 
      id: 'bottlesPricePerUnit', 
      title: 'Bottles', 
      desc: 'Set the base price per single bottle.', 
      unit: '₦ / Unit',
      color: 'border-l-cyan-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Global Pricing & Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Set the base prices that will be used across the entire website and stock system.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pricingCards.map((card) => (
          <div key={card.id} className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 ${card.color}`}>
            <h2 className="text-lg font-bold text-gray-900 mb-1">{card.title}</h2>
            <p className="text-sm text-gray-500 mb-4">{card.desc}</p>
            
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-sm">Base Price:</span>
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">₦</span>
                <input 
                  type="number"
                  value={settings[card.id]}
                  onChange={(e) => updateSetting(card.id, e.target.value)}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>
              <span className="text-sm text-gray-500 font-medium whitespace-nowrap">{card.unit}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800">
        <strong>Note:</strong> Changes made here are saved automatically and will reflect immediately on the public e-commerce website and the internal stock entry pages.
      </div>
    </div>
  );
}
