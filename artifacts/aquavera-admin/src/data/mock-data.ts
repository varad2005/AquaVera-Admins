import { subDays, subHours } from 'date-fns';

export type RequestStatus = 'Pending' | 'Approved' | 'Rejected' | 'Flagged';
export type GeoStatus = 'Valid' | 'Invalid' | 'Pending';

export interface WaterRequest {
  id: string;
  farmerName: string;
  aadhaar: string;
  landId: string;
  village: string;
  district: string;
  cropType: string;
  durationHours: number;
  startDate: string;
  calculatedBilling: number;
  geoStatus: GeoStatus;
  status: RequestStatus;
  paymentStatus?: 'Paid' | 'Unpaid';
  confidenceScore: number;
  ndviIndex: number;
  assignedTo?: string;
  evidenceImage?: string;
  latitude?: number;
  longitude?: number;
  deviceInfo?: string;
  timestamp: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  role: string;
  status: 'Active' | 'Inactive';
  lastLogin: string;
}

export interface Log {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  ip: string;
  role: string;
}

const now = new Date();

export const MOCK_REQUESTS: WaterRequest[] = [];

export const MOCK_USERS: User[] = [];

export const MOCK_LOGS: Log[] = [];
