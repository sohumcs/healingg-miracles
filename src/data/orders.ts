
export const mockOrders = [
  {
    id: 'ORD7839201',
    date: '2025-03-15',
    total: 87.95,
    items: [
      { id: 1, name: 'Amethyst Cluster', quantity: 1, price: 42.99 },
      { id: 2, name: 'Lavender Bath Salt', quantity: 2, price: 22.98 }
    ],
    status: 'delivered',
    trackingNumber: 'TRK5839221'
  },
  {
    id: 'ORD7839185',
    date: '2025-02-28',
    total: 65.50,
    items: [
      { id: 3, name: 'Crystal Tealight Holder', quantity: 1, price: 35.50 },
      { id: 4, name: 'Rose Quartz', quantity: 1, price: 30.00 }
    ],
    status: 'processing',
    trackingNumber: 'TRK5839205'
  }
];
