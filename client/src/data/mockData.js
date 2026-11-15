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

// Add this to the bottom of src/data/mockData.js

export const orders = [
  {
    id: 'ORD-1001',
    date: '2026-11-14',
    customer: { name: 'Emeka Johnson', phone: '08012345678', address: '14 Allen Avenue, Ikeja, Lagos' },
    items: [
      { name: '18 x 0.18', variant: '19.8kg (Single Roll)', quantity: 2, price: 54450 }
    ],
    total: 108900,
    status: 'Pending'
  },
  {
    id: 'ORD-1002',
    date: '2026-11-13',
    customer: { name: 'Chioma Adeleke', phone: '08098765432', address: '22 Admiralty Way, Lekki, Lagos' },
    items: [
      { name: 'Premium Pure Water (50cl)', variant: 'Pack of 20', quantity: 50, price: 1500 },
      { name: 'Empty PET Bottles', variant: '500ml', quantity: 10, price: 2000 }
    ],
    total: 95000,
    status: 'Processing'
  },
  {
    id: 'ORD-1003',
    date: '2026-11-12',
    customer: { name: 'Tunde Bakare', phone: '07033334444', address: '5 Oba Akran Avenue, Ikeja, Lagos' },
    items: [
      { name: 'Heavy Duty Packing Bags', variant: '5.0', quantity: 100, price: 1750 }
    ],
    total: 175000,
    status: 'Delivered'
  }
];

// Add or replace these in src/data/mockData.js

export const transactions = [
  { id: 'TXN-001', date: '2026-11-14', type: 'Sale', description: 'Walk-in Sale: 50 packs of 50cl Water', amount: 75000, status: 'Completed' },
  { id: 'TXN-002', date: '2026-11-14', type: 'Expense', description: 'Fuel for Delivery Truck', amount: 15000, status: 'Approved' },
  { id: 'TXN-003', date: '2026-11-13', type: 'Sale', description: 'Walk-in Sale: 20 Heavy Duty Packing Bags', amount: 35000, status: 'Completed' },
  { id: 'TXN-004', date: '2026-11-12', type: 'Expense', description: 'Generator Maintenance', amount: 25000, status: 'Approved' },
  { id: 'TXN-005', date: '2026-11-10', type: 'Expense', description: 'Purchase of Raw Plastic Preforms', amount: 120000, status: 'Approved' }
];

export const payrollRecords = [
  { id: 'PAY-001', worker: 'John Worker', month: 'November 2026', baseSalary: 45000, bonus: 5000, deductions: 0, netPay: 50000, status: 'Pending' },
  { id: 'PAY-002', worker: 'Jane Worker', month: 'November 2026', baseSalary: 45000, bonus: 2000, deductions: 0, netPay: 47000, status: 'Paid' },
  { id: 'PAY-003', worker: 'Mike Worker', month: 'November 2026', baseSalary: 40000, bonus: 0, deductions: 2000, netPay: 38000, status: 'Paid' }
];