// // types/index.ts

// // ---- User Types ------------------------------------------------------------

// export interface User {
//   id: string;
//   name: string;
//   email: string;
//   role: 'user' | 'admin';
//   emailVerified: boolean;
//   isActive: boolean;
//   createdAt: string;
//   updatedAt: string;
//   lastLogin?: string;
//   phone?: string;
//   address?: string;
//   accountType?: 'personal' | 'business';
// }

// export interface UserPublic {
//   id: string;
//   name: string;
//   email: string;
//   role: 'user' | 'admin';
//   emailVerified: boolean;
//   isActive: boolean;
//   createdAt: string;
//   updatedAt: string;
//   lastLogin?: string;
// }

// // ---- Bill Types ------------------------------------------------------------

// export interface Bill {
//   id: string;
//   title: string;
//   amount: number;
//   dueDate: string;
//   status: 'paid' | 'unpaid' | 'overdue';
//   category: string;
//   paidDate?: string;
//   description?: string;
//   createdAt: string;
// }

// export interface BillCreateInput {
//   title: string;
//   amount: number;
//   dueDate: string;
//   category: string;
//   description?: string;
// }

// export interface BillUpdateInput {
//   status?: 'paid' | 'unpaid' | 'overdue';
//   paidDate?: string;
// }

// // ---- Transaction Types -----------------------------------------------------

// export interface Transaction {
//   id: string;
//   type: 'payment' | 'transfer' | 'deposit';
//   amount: number;
//   description: string;
//   date: string;
//   status: 'completed' | 'pending' | 'failed';
//   reference?: string;
// }

// // ---- Dashboard Types -------------------------------------------------------

// export interface DashboardStats {
//   totalBills: number;
//   paidBills: number;
//   unpaidBills: number;
//   overdueBills: number;
//   totalSpent: number;
//   upcomingBills: Bill[];
//   recentTransactions: Transaction[];
//   paymentMethods: PaymentMethod[];
//   preferences: DashboardPreferences;
// }

// export interface DashboardPreferences {
//   theme: 'light' | 'dark';
//   notifications: boolean;
//   currency: string;
// }

// export interface PaymentMethod {
//   id: string;
//   type: 'card' | 'bank' | 'paypal';
//   last4: string;
//   expiryDate?: string;
//   isDefault: boolean;
//   name?: string;
// }

// // ---- Chat Types ------------------------------------------------------------

// export interface ChatParticipant {
//   userId: string;
//   role: 'admin' | 'user';
//   name: string;
// }

// export interface ChatMessage {
//   id: string;
//   senderId: string;
//   senderName: string;
//   senderRole: 'admin' | 'user';
//   message: string;
//   timestamp: string;
//   read: boolean;
//   type: 'text' | 'attachment';
//   attachmentUrl?: string;
// }

// export interface ChatRoom {
//   id: string;
//   participants: ChatParticipant[];
//   messages: ChatMessage[];
//   lastMessage: {
//     text: string;
//     timestamp: string;
//     senderId: string;
//   } | null;
//   unreadCount: Record<string, number>;
//   createdAt: string;
//   updatedAt: string;
// }

// export interface ChatRoomListItem {
//   id: string;
//   participants: ChatParticipant[];
//   lastMessage: {
//     text: string;
//     timestamp: string;
//     senderId: string;
//   } | null;
//   unreadCount: Record<string, number>;
//   updatedAt: string;
// }

// // ---- Auth Types ------------------------------------------------------------

// export interface LoginCredentials {
//   email: string;
//   password: string;
// }

// export interface RegisterCredentials {
//   name: string;
//   email: string;
//   password: string;
//   phone?: string;
//   accountType?: 'personal' | 'business';
// }

// export interface AuthResponse {
//   success: boolean;
//   message?: string;
//   user: User;
//   token: string;
// }

// // ---- API Response Types ----------------------------------------------------

// export interface ApiResponse<T = any> {
//   success: boolean;
//   message?: string;
//   data?: T;
//   error?: string;
// }

// export interface ApiError {
//   success: false;
//   error: string;
//   status: number;
// }

// // ---- Component Props -------------------------------------------------------

// export interface BillCardProps {
//   bill: Bill;
//   onPay?: (billId: string) => Promise<void>;
//   onView?: (billId: string) => void;
//   onDelete?: (billId: string) => Promise<void>;
//   isAdmin?: boolean;
// }

// export interface RecentTransactionsProps {
//   transactions: Transaction[];
//   limit?: number;
//   onViewAll?: () => void;
// }

// export interface ChatWindowProps {
//   roomId: string;
//   userId: string;
//   userName?: string;
//   userRole?: 'user' | 'admin';
//   onClose?: () => void;
// }

// export interface MessageListProps {
//   messages: ChatMessage[];
//   currentUserId: string;
// }

// export interface MessageInputProps {
//   onSend: (message: string) => Promise<void>;
//   disabled?: boolean;
//   placeholder?: string;
// }

// export interface AdminChatPanelProps {
//   userId: string;
//   userName: string;
//   onClose?: () => void;
// }

// export interface UserListProps {
//   users: User[];
//   onSelectUser: (user: User) => void;
//   selectedUserId?: string;
//   loading?: boolean;
// }

// export interface AdminDashboardProps {
//   stats: {
//     totalUsers: number;
//     totalBills: number;
//     pendingBills: number;
//     revenue: number;
//   };
//   recentUsers: User[];
//   recentBills: Bill[];
// }

// // ---- Admin Types -----------------------------------------------------------

// export interface AdminStats {
//   totalUsers: number;
//   totalBills: number;
//   pendingBills: number;
//   overdueBills: number;
//   revenue: number;
// }
// types/index.ts

// ---- User Types ------------------------------------------------------------

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  displayName?: string;
  email: string;
  role: 'user' | 'admin';
  accountType?: 'personal' | 'business';
  emailVerified: boolean;
  isActive: boolean;
  loginCount?: number;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  phone?: string;
}

export interface UserPublic {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  displayName?: string;
  email: string;
  role: 'user' | 'admin';
  emailVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

// ---- Bill Types ------------------------------------------------------------

export interface Bill {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'unpaid' | 'overdue';
  category: string;
  paidDate?: string;
  description?: string;
  createdAt: string;
}

export interface BillCreateInput {
  title: string;
  amount: number;
  dueDate: string;
  category: string;
  description?: string;
}

export interface BillUpdateInput {
  status?: 'paid' | 'unpaid' | 'overdue';
  paidDate?: string;
}

// ---- Transaction Types -----------------------------------------------------

export interface Transaction {
  id: string;
  type: 'payment' | 'transfer' | 'deposit';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  reference?: string;
}

// ---- Dashboard Types -------------------------------------------------------

export interface DashboardStats {
  totalBills: number;
  paidBills: number;
  unpaidBills: number;
  overdueBills: number;
  totalSpent: number;
  upcomingBills: Bill[];
  recentTransactions: Transaction[];
  paymentMethods: PaymentMethod[];
  preferences: DashboardPreferences;
}

export interface DashboardPreferences {
  theme: 'light' | 'dark';
  notifications: boolean;
  currency: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'paypal';
  last4: string;
  expiryDate?: string;
  isDefault: boolean;
  name?: string;
}

// ---- Chat Types ------------------------------------------------------------

export interface ChatParticipant {
  userId: string;
  role: 'admin' | 'user';
  name: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'admin' | 'user';
  message: string;
  timestamp: string;
  read: boolean;
  type: 'text' | 'attachment';
  attachmentUrl?: string;
}

export interface ChatRoom {
  id: string;
  participants: ChatParticipant[];
  messages: ChatMessage[];
  lastMessage: {
    text: string;
    timestamp: string;
    senderId: string;
  } | null;
  unreadCount: Record<string, number>;
  createdAt: string;
  updatedAt: string;
}

export interface ChatRoomListItem {
  id: string;
  participants: ChatParticipant[];
  lastMessage: {
    text: string;
    timestamp: string;
    senderId: string;
  } | null;
  unreadCount: Record<string, number>;
  updatedAt: string;
}

// ---- Auth Types ------------------------------------------------------------

export interface LoginCredentials {
  identifier: string;     // Can be email OR username
  password: string;
}

export interface RegisterCredentials {
  firstName: string;
  lastName: string;
  username: string;
  displayName?: string;
  email: string;
  password: string;
  phone?: string;
  accountType?: 'personal' | 'business';
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user: User;
  token: string;
}

// ---- API Response Types ----------------------------------------------------

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface ApiError {
  success: false;
  error: string;
  status: number;
}

// ---- Component Props -------------------------------------------------------

export interface BillCardProps {
  bill: Bill;
  onPay?: (billId: string) => Promise<void>;
  onView?: (billId: string) => void;
  onDelete?: (billId: string) => Promise<void>;
  isAdmin?: boolean;
}

export interface RecentTransactionsProps {
  transactions: Transaction[];
  limit?: number;
  onViewAll?: () => void;
}

export interface ChatWindowProps {
  roomId: string;
  userId: string;
  userName?: string;
  userRole?: 'user' | 'admin';
  onClose?: () => void;
}

export interface MessageListProps {
  messages: ChatMessage[];
  currentUserId: string;
}

export interface MessageInputProps {
  onSend: (message: string) => Promise<void>;
  disabled?: boolean;
  placeholder?: string;
}

export interface AdminChatPanelProps {
  userId: string;
  userName: string;
  onClose?: () => void;
}

export interface UserListProps {
  users: User[];
  onSelectUser: (user: User) => void;
  selectedUserId?: string;
  loading?: boolean;
}

export interface AdminDashboardProps {
  stats: {
    totalUsers: number;
    totalBills: number;
    pendingBills: number;
    revenue: number;
  };
  recentUsers: User[];
  recentBills: Bill[];
}

// ---- Admin Types -----------------------------------------------------------

export interface AdminStats {
  totalUsers: number;
  totalBills: number;
  pendingBills: number;
  overdueBills: number;
  revenue: number;
}