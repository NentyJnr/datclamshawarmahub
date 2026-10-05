export type UserRole = 'Customer' | 'KitchenStaff' | 'DispatchRider' | 'Admin';

export type OrderStatus = 'Preparing' | 'ReadyForPickup' | 'InTransit' | 'Delivered' | 'Cancelled';

export type PaymentMethod = 'PaystackOnline' | 'Card' | 'Transfer' | 'Bank' | 'USSD' | 'OPay';
export type PaymentStatus = 'Paid' | 'Pending';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isAvailable: boolean;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface AvailableRider {
  riderId: string;
  userId: string;
  riderName: string;
  phoneNumber: string;
  currentLatitude: number;
  currentLongitude: number;
  distanceToStoreKm: number;
  storeToCustomerKm: number;
  totalTripDistanceKm: number;
  estimatedTimeToStoreMinutes: number;
  estimatedTimeToCustomerMinutes: number;
  totalEtaMinutes: number;
  isCalculationFallback: boolean;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  menuItemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  dispatchRiderId: string;
  riderName: string;
  deliveryLatitude: number;
  deliveryLongitude: number;
  formattedAddress: string;
  subtotal: number;
  fixedDeliveryFee: number;
  grandTotal: number;
  pickupVerificationCode: string;
  orderStatus: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  createdAt: string;
  pickedUpAt?: string;
  deliveredAt?: string;
  items: OrderItem[];
}

export interface StandardApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}
