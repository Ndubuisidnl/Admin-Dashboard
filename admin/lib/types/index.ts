// Wood House Cafe — Type Definitions

export type UserRole = "customer" | "admin";

export type OrderType = "pickup" | "delivery";
export type PaymentMethod = "card" | "cash" | "online";

export type OrderStatus =
  | "received"
  | "preparing"
  | "ready"
  | "out-for-delivery"
  | "collected"
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
  | "starters"
  | "salads"
  | "main-dishes"
  | "sides"
  | "pasta"
  | "coffee"
  | "drinks"
  | "desserts";

export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  price_secondary: number | null;
  price_display: string | null;
  category: MenuCategory;
  image_url: string | null;
  image_label: string | null;
  available: boolean;
  featured: boolean;
  tags: string[];
  preparation_time: string | null;
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
  menu_item_id: string;
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
  delivery_fee: number;
  total: number;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface Reservation {
  id: string;
  user_id: string | null;
  full_name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guest_count: number;
  occasion: string | null;
  special_requests: string | null;
  status: ReservationStatus;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  is_read: boolean;
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
