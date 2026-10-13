// Wood House Cafe — Type Definitions

export type UserRole = "customer" | "admin";

export type OrderType = "pickup" | "delivery";
export type PaymentMethod = "pay-on-delivery" | "pay-on-pickup" | "pay-at-restaurant";

export type OrderStatus =
  | "received"
  | "preparing"
  | "ready"
  | "ready-for-pickup"
  | "out-for-delivery"
  | "collected"
  | "delivered"
  | "cancelled";

export type ReservationStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled";

export type MenuCategory =
  | "breakfast"
  | "burgers"
  | "sandwiches"
  | "main-dishes"
  | "pasta"
  | "rice"
  | "chicken"
  | "snacks"
  | "coffee"
  | "drinks"
  | "desserts";

export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  image_url: string | null;
  image_label: string;
  available: boolean;
  featured: boolean;
  tags: string[];
  preparation_time: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DeliveryAddress {
  label?: string;
  address: string;
  landmark?: string;
  city?: string;
  phone?: string;
}

export interface MenuItemSnapshot {
  id: string;
  name: string;
  price: number;
  category: string;
  image_label?: string | null;
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string | null;
  menu_item_snapshot: MenuItemSnapshot;
  quantity: number;
  unit_price: number;
  special_instructions?: string | null;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string | null;
  full_name: string;
  phone: string;
  email: string;
  order_type: OrderType;
  payment_method: PaymentMethod;
  delivery_address: DeliveryAddress | null;
  general_note: string | null;
  subtotal: number;
  delivery_fee: number | null;
  total: number;
  status: OrderStatus;
  created_at: string;
  items?: OrderItem[];
}

export interface Reservation {
  id: string;
  user_id: string | null;
  full_name: string;
  email: string;
  phone: string;
  reservation_date: string;
  reservation_time: string;
  guest_count: number;
  occasion: string;
  special_requests: string;
  status: ReservationStatus;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  created_at: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  created_at: string;
}

export interface DashboardStats {
  todayRevenue: number;
  todayOrdersCount: number;
  pendingReservationsCount: number;
  unreadMessagesCount: number;
  recentOrders: Order[];
  todayReservations: Reservation[];
}

export interface OrderCreationItemInput {
  menu_item_id: string;
  quantity: number;
  special_instructions?: string;
}

export interface OrderCreationInput {
  user_id?: string | null;
  full_name: string;
  phone: string;
  email: string;
  order_type: OrderType;
  payment_method: PaymentMethod;
  delivery_address?: DeliveryAddress | null;
  general_note?: string | null;
  items: OrderCreationItemInput[];
}
