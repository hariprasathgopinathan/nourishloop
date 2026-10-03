/**
 * NGO Mock Data — Temporary frontend demo data
 * 
 * This file contains realistic mock donations and claims for
 * NGO dashboard UI prototyping. All data here will be replaced
 * by real API responses once backend integration is implemented.
 * 
 * DO NOT use this data for production purposes.
 */

// Simulated available donations from various donors nearby
export const mockAvailableDonations = [
  {
    _id: 'don_001',
    foodName: 'Vegetable Biryani',
    category: 'Prepared Meals',
    quantity: 30,
    unit: 'Plates',
    description: 'Freshly prepared vegetable biryani from a corporate event. Packed in hygienic containers.',
    pickupAddress: '14, Anna Salai, Perambur, Chennai',
    pincode: '600011',
    availableUntil: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours
    status: 'AVAILABLE',
    donorName: 'Grand Meridian Hotel',
    distance: 1.2,
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
  {
    _id: 'don_002',
    foodName: 'Whole Wheat Bread',
    category: 'Bakery',
    quantity: 50,
    unit: 'Packets',
    description: 'Day-fresh whole wheat bread loaves. Best consumed within 24 hours.',
    pickupAddress: '32, Mint Street, Sowcarpet, Chennai',
    pincode: '600079',
    availableUntil: new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString(), // 18 hours
    status: 'AVAILABLE',
    donorName: 'Baker Street Bakery',
    distance: 2.4,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'don_003',
    foodName: 'Fresh Fruits Assortment',
    category: 'Produce',
    quantity: 25,
    unit: 'kg',
    description: 'Mixed seasonal fruits — bananas, apples, and oranges. Slightly overripe but perfectly edible.',
    pickupAddress: '8, Koyambedu Market, Chennai',
    pincode: '600107',
    availableUntil: new Date(Date.now() + 36 * 60 * 60 * 1000).toISOString(), // 36 hours
    status: 'AVAILABLE',
    donorName: 'Koyambedu Fresh Mart',
    distance: 5.1,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'don_004',
    foodName: 'Packed Idli & Sambar',
    category: 'Prepared Meals',
    quantity: 100,
    unit: 'Plates',
    description: 'Leftover idli and sambar from morning catering. Packed individually.',
    pickupAddress: '55, T. Nagar, Chennai',
    pincode: '600017',
    availableUntil: new Date(Date.now() + 0.5 * 60 * 60 * 1000).toISOString(), // 30 mins - CRITICAL
    status: 'AVAILABLE',
    donorName: 'Saravana Bhavan - T. Nagar',
    distance: 3.8,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    _id: 'don_005',
    foodName: 'Curd Rice',
    category: 'Prepared Meals',
    quantity: 40,
    unit: 'Plates',
    description: 'Curd rice prepared for a function. Chilled and hygienic.',
    pickupAddress: '22, Adyar, Chennai',
    pincode: '600020',
    availableUntil: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(), // 5 hours - URGENT
    status: 'AVAILABLE',
    donorName: 'Hotel Rathna Residency',
    distance: 4.2,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'don_006',
    foodName: 'Milk Packets',
    category: 'Dairy',
    quantity: 30,
    unit: 'Litres',
    description: 'Full cream milk packets nearing best-before date. Still fresh.',
    pickupAddress: '12, Royapuram, Chennai',
    pincode: '600013',
    availableUntil: new Date(Date.now() + 10 * 60 * 60 * 1000).toISOString(), // 10 hours
    status: 'AVAILABLE',
    donorName: 'Daily Fresh Dairy',
    distance: 1.8,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'don_007',
    foodName: 'Biscuit Packets',
    category: 'Packaged Food',
    quantity: 200,
    unit: 'Packets',
    description: 'Assorted biscuit packets. Short-dated stock but well within safety.',
    pickupAddress: '90, Anna Nagar, Chennai',
    pincode: '600040',
    availableUntil: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(), // 3 days
    status: 'AVAILABLE',
    donorName: 'Metro Wholesale Store',
    distance: 6.3,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'don_008',
    foodName: 'Chapati & Dal',
    category: 'Prepared Meals',
    quantity: 60,
    unit: 'Plates',
    description: 'Freshly made chapati and dal from wedding catering.',
    pickupAddress: '5, Egmore, Chennai',
    pincode: '600008',
    availableUntil: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours
    status: 'AVAILABLE',
    donorName: 'Royal Caterers',
    distance: 2.9,
    createdAt: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
  },
];

// Simulated claims made by this NGO
export const mockClaims = [
  {
    _id: 'claim_001',
    donationId: 'don_100',
    foodName: 'Sambar Rice',
    category: 'Prepared Meals',
    quantity: 50,
    unit: 'Plates',
    donorName: 'Hotel Saravana',
    pickupAddress: '10, Mount Road, Chennai',
    status: 'CLAIMED',
    claimedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    availableUntil: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'claim_002',
    donationId: 'don_101',
    foodName: 'Fresh Bread Loaves',
    category: 'Bakery',
    quantity: 30,
    unit: 'Pieces',
    donorName: 'Baker Street Bakery',
    pickupAddress: '32, Mint Street, Chennai',
    status: 'READY_FOR_PICKUP',
    claimedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    availableUntil: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'claim_003',
    donationId: 'don_102',
    foodName: 'Packed Meals (Lunch)',
    category: 'Prepared Meals',
    quantity: 80,
    unit: 'Plates',
    donorName: 'Grand Meridian Hotel',
    pickupAddress: '14, Anna Salai, Chennai',
    status: 'PICKED_UP',
    claimedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    pickedUpAt: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
    availableUntil: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'claim_004',
    donationId: 'don_103',
    foodName: 'Fruit Baskets',
    category: 'Produce',
    quantity: 15,
    unit: 'kg',
    donorName: 'Fresh Mart Store',
    pickupAddress: '20, Nungambakkam, Chennai',
    status: 'PICKED_UP',
    claimedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    pickedUpAt: new Date(Date.now() - 46 * 60 * 60 * 1000).toISOString(),
    availableUntil: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'claim_005',
    donationId: 'don_104',
    foodName: 'Vegetable Curry',
    category: 'Prepared Meals',
    quantity: 25,
    unit: 'Plates',
    donorName: 'Anjappar Restaurant',
    pickupAddress: '8, Chetpet, Chennai',
    status: 'EXPIRED',
    claimedAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
    availableUntil: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
  },
];

// Simulated notifications
export const mockNotifications = [
  {
    id: 'notif_001',
    type: 'claim_confirmed',
    title: 'Claim confirmed',
    message: 'Your claim for Sambar Rice (50 Plates) has been confirmed.',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: 'notif_002',
    type: 'ready_for_pickup',
    title: 'Ready for pickup',
    message: 'Fresh Bread Loaves is now ready for pickup at Baker Street Bakery.',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: 'notif_003',
    type: 'new_donation',
    title: 'New donation nearby',
    message: 'Vegetable Biryani (30 Plates) is now available 1.2 km from you.',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
  {
    id: 'notif_004',
    type: 'pickup_completed',
    title: 'Pickup completed',
    message: 'Your pickup of Packed Meals has been confirmed. Thank you!',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
  {
    id: 'notif_005',
    type: 'expiry_warning',
    title: 'Expiry approaching',
    message: 'Sambar Rice expires in 3 hours. Please arrange pickup soon.',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    read: false,
  },
];

// NGO dashboard stats (mock)
export const mockNgoStats = {
  availableNearby: 8,
  activeClaims: 2,
  readyForPickup: 1,
  completedPickups: 47,
};

// Mock NGO profile
export const mockNgoProfile = {
  name: 'Hope Foundation',
  initials: 'HF',
  email: 'contact@hopefoundation.org',
  phone: '+91 98765 43210',
  address: '45, Greams Road, Thousand Lights, Chennai',
  pincode: '600006',
  description: 'A non-profit organization dedicated to fighting hunger and food waste in Chennai. We redistribute surplus food to underprivileged communities, shelters, and orphanages.',
  registrationNumber: 'NGO-TN-2024-0892',
  membersCount: 24,
};
