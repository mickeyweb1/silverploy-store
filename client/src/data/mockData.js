// src/data/mockData.js

export const users = [
  { id: 1, name: 'Admin User', email: 'admin@silversemat.com', password: 'admin123', role: 'admin' },
  { id: 2, name: 'Sarah Secretary', email: 'sec@silversemat.com', password: 'sec123', role: 'secretary' },
  { id: 3, name: 'John Worker', email: 'worker@silversemat.com', password: 'worker123', role: 'worker' },
];

export const products = [
  {
    id: 1,
    category: 'Pure Water',
    name: 'Premium Pure Water (50cl)',
    description: 'Nafdac approved, crisp and refreshing purified drinking water.',
    image: 'https://placehold.co/400x400/e0f2fe/0369a1?text=Pure+Water',
    variants: [
      { id: 'v1', name: 'Pack of 20', price: 1500, stock: 450 }
    ]
  },
// Find the Shrink Wrapper products in mockData.js and update them like this:

  {
    id: 2,
    category: 'Shrink Wrapper',
    name: '18 x 0.18', 
    description: 'High-quality industrial shrink wrap. Price calculated by exact roll weight (₦2,750/kg).',
    basePricePerKg: 2750,
    image: 'https://placehold.co/400x400/f3f4f6/4b5563?text=18+x+0.18',
    variants: [
      { id: 'v1', rollType: 'Single', weightKg: 19.8, stock: 1 },
      { id: 'v2', rollType: 'Double', weightKg: 39.6, stock: 1 },
      { id: 'v3', rollType: 'Single', weightKg: 25.9, stock: 1 },
      { id: 'v4', rollType: 'Double', weightKg: 30.4, stock: 1 }
    ]
  },
  {
    id: 3,
    category: 'Shrink Wrapper',
    name: '11 x 0.18', 
    description: 'High-quality industrial shrink wrap. Price calculated by exact roll weight (₦2,750/kg).',
    basePricePerKg: 2750,
    image: 'https://placehold.co/400x400/fef3c7/b45309?text=11+x+0.18',
    variants: [
      { id: 'v1', rollType: 'Single', weightKg: 17.6, stock: 1 },
      { id: 'v2', rollType: 'Double', weightKg: 35.2, stock: 1 },
      { id: 'v3', rollType: 'Single', weightKg: 29.6, stock: 1 }
    ]
  },
  {
    id: 4,
    category: 'Packing Bags',
    name: 'Heavy Duty Packing Bags',
    description: 'Durable, tear-resistant packing bags for retail and wholesale.',
    image: 'https://placehold.co/400x400/fef3c7/b45309?text=Packing+Bags',
    variants: [
      { id: 'v1', size: '5.0', pricePerPack: 1750, stock: 500 },
      { id: 'v2', size: '4.8', pricePerPack: 1680, stock: 400 },
      { id: 'v3', size: '3.6', pricePerPack: 1260, stock: 600 }
    ]
  },
  {
    id: 5,
    category: 'Bottles',
    name: 'Empty PET Bottles',
    description: 'Food-grade, BPA-free empty PET bottles ready for filling.',
    image: 'https://placehold.co/400x400/f0f9ff/0284c7?text=PET+Bottles',
    variants: [
      { id: 'v1', size: '700ml', pricePerPack: 2500, stock: 200 },
      { id: 'v2', size: '500ml', pricePerPack: 2000, stock: 300 },
      { id: 'v3', size: '300ml', pricePerPack: 1500, stock: 500 }
    ]
  }
];

export const rawMaterials = [
  { id: 201, name: 'Plastic Preforms (for 50cl)', stock: 5000, unit: 'pieces' },
  { id: 202, name: 'Bottle Caps (Blue)', stock: 4800, unit: 'pieces' },
  { id: 203, name: 'Product Labels (Roll)', stock: 15, unit: 'rolls' },
  { id: 204, name: 'Shrink Film (Raw)', stock: 200, unit: 'kg' }
];

export const recentTransactions = [
  { id: 'TXN-001', date: '2026-11-13', type: 'Sale', item: 'Pure Water (50cl)', quantity: 50, amount: 75000, status: 'Completed' },
  { id: 'TXN-002', date: '2026-11-13', type: 'Expense', item: 'Fuel for Delivery Truck', quantity: 1, amount: 15000, status: 'Approved' }
];

export const productionLogs = [
  { id: 'PROD-001', date: '2026-11-13', worker: 'John Worker', product: 'Pure Water (50cl)', produced: 400, materialsUsed: 'Preforms: 400, Caps: 400', status: 'Logged' }
];

export const payroll = [
  { id: 'PAY-001', worker: 'John Worker', month: 'November 2026', baseSalary: 45000, bonus: 5000, deductions: 0, netPay: 50000, status: 'Pending' }
];
