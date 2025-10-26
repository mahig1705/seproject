export enum UserRole {
  ADMIN = 'admin',
  COMMITTEE = 'committee',
  RESIDENT = 'resident',
  TENANT = 'tenant',
  SECURITY = 'security',
  TECHNICIAN = 'technician'
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other'
}

export enum IssueStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed'
}

export enum TicketStatus {
  PENDING = 'pending',
  ASSIGNED = 'assigned',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum BookingStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled'
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

export interface User {
  _id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  flatNumber?: string;
  building?: string;
  occupantsCount?: number;
  profile?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse<T = any> {
  success: boolean;
  data: T;
  message: string;
}


export interface Issue {
  _id: string;
  title: string;
  description: string;
  images?: string[];
  status: IssueStatus;
  reporter?: { _id: string; name: string };
  technician?: { _id: string; name: string }; // <-- add this
  createdAt: string;
  updatedAt: string;
}



export interface Visitor {
  _id: string;
  name: string;
  vehicle?: string;
  purpose: string;
  hostId: string;
  host: User;
  inTime: string;
  outTime?: string;
  createdAt: string;
}

export interface Bill {
  _id: string;
  userId: string;
  user: User;
  amount: number;
  dueDate: string;
  status: PaymentStatus;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  _id: string;
  billId: string;
  bill: Bill;
  amount: number;
  gatewayRef: string;
  status: PaymentStatus;
  createdAt: string;
}

export interface Notice {
  _id: string;
  title: string;
  description: string; // ✅ match backend
  visibleFrom: string;
  visibleUntil: string;
  pinned: boolean;
  audience: UserRole[];
  createdAt: string;
  updatedAt: string;
}

export interface Amenity {
  _id: string;
  name: string;
  description: string;
  capacity: number;
  rules: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  _id: string;
  amenityId: string;
  amenity: Amenity;
  userId: string;
  user: User;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  technicianId?: string;
  technician?: User;
  createdAt: string;
  updatedAt: string;
}

export interface Technician {
  _id: string;
  name: string;
  contact: string;
  specializations: string[];
  availability: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
