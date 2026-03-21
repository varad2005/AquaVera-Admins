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
  confidenceScore: number;
  ndviIndex: number;
  assignedTo?: string;
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

export const MOCK_REQUESTS: WaterRequest[] = [
  {
    id: 'REQ-1001',
    farmerName: 'Ramesh Patel',
    aadhaar: 'XXXX-XXXX-4592',
    landId: 'MH-7/12-84920',
    village: 'Niphad',
    district: 'Nashik',
    cropType: 'Wheat',
    durationHours: 12,
    startDate: subDays(now, 1).toISOString(),
    calculatedBilling: 1450,
    geoStatus: 'Valid',
    status: 'Pending',
    confidenceScore: 94,
    ndviIndex: 0.72,
    timestamp: subHours(now, 5).toISOString(),
  },
  {
    id: 'REQ-1002',
    farmerName: 'Sunil Kumar',
    aadhaar: 'XXXX-XXXX-1102',
    landId: 'MH-7/12-33211',
    village: 'Baramati',
    district: 'Pune',
    cropType: 'Sugarcane',
    durationHours: 24,
    startDate: subDays(now, 0).toISOString(),
    calculatedBilling: 2900,
    geoStatus: 'Invalid',
    status: 'Flagged',
    confidenceScore: 45,
    ndviIndex: 0.31,
    timestamp: subHours(now, 12).toISOString(),
  },
  {
    id: 'REQ-1003',
    farmerName: 'Priya Sharma',
    aadhaar: 'XXXX-XXXX-8831',
    landId: 'MH-7/12-99021',
    village: 'Paithan',
    district: 'Pune',
    cropType: 'Cotton',
    durationHours: 8,
    startDate: subDays(now, 2).toISOString(),
    calculatedBilling: 980,
    geoStatus: 'Valid',
    status: 'Approved',
    confidenceScore: 98,
    ndviIndex: 0.81,
    timestamp: subDays(now, 1).toISOString(),
  },
  {
    id: 'REQ-1004',
    farmerName: 'Vijay Deshmukh',
    aadhaar: 'XXXX-XXXX-2244',
    landId: 'MH-7/12-55612',
    village: 'Karvir',
    district: 'Kolhapur',
    cropType: 'Rice',
    durationHours: 16,
    startDate: subDays(now, 0).toISOString(),
    calculatedBilling: 1800,
    geoStatus: 'Valid',
    status: 'Pending',
    confidenceScore: 88,
    ndviIndex: 0.65,
    timestamp: subHours(now, 2).toISOString(),
  },
  {
    id: 'REQ-1005',
    farmerName: 'Anil Jadhav',
    aadhaar: 'XXXX-XXXX-6612',
    landId: 'MH-7/12-11234',
    village: 'Vaijapur',
    district: 'Aurangabad',
    cropType: 'Wheat',
    durationHours: 10,
    startDate: subDays(now, 3).toISOString(),
    calculatedBilling: 1200,
    geoStatus: 'Valid',
    status: 'Rejected',
    confidenceScore: 91,
    ndviIndex: 0.45,
    timestamp: subDays(now, 2).toISOString(),
  },
  {
    id: 'REQ-1006',
    farmerName: 'Sanjay Pawar',
    aadhaar: 'XXXX-XXXX-9921',
    landId: 'MH-7/12-77812',
    village: 'Shirur',
    district: 'Pune',
    cropType: 'Sugarcane',
    durationHours: 48,
    startDate: subDays(now, 0).toISOString(),
    calculatedBilling: 5800,
    geoStatus: 'Pending',
    status: 'Pending',
    confidenceScore: 65,
    ndviIndex: 0.55,
    timestamp: subHours(now, 1).toISOString(),
  },
];

export const MOCK_USERS: User[] = [
  { id: 'USR-001', name: 'Admin User 1', email: 'admin1@example.com', phone: '9876543210', role: 'Admin', status: 'Active', lastLogin: subHours(now, 1).toISOString() },
  { id: 'USR-002', name: 'Sub-Admin North', email: 'north@example.com', phone: '9876543211', role: 'Sub-Admin', status: 'Active', lastLogin: subHours(now, 4).toISOString() },
  { id: 'USR-003', name: 'Sub-Admin South', email: 'south@example.com', phone: '9876543212', role: 'Sub-Admin', status: 'Inactive', lastLogin: subDays(now, 5).toISOString() },
  { id: 'USR-004', name: 'Ramesh Patel', email: 'ramesh@example.com', phone: '9876543213', role: 'Farmer', status: 'Active', lastLogin: subDays(now, 1).toISOString() },
  { id: 'USR-005', name: 'Sunil Kumar', email: 'sunil@example.com', phone: '9876543214', role: 'Farmer', status: 'Active', lastLogin: subDays(now, 2).toISOString() },
];

export const MOCK_LOGS: Log[] = [
  { id: 'LOG-1', timestamp: subHours(now, 1).toISOString(), user: 'Admin User 1', action: 'Approved Request #REQ-1003', ip: '192.168.1.45', role: 'Admin' },
  { id: 'LOG-2', timestamp: subHours(now, 2).toISOString(), user: 'System', action: 'Auto-flagged Request #REQ-1002 (Low Confidence)', ip: '127.0.0.1', role: 'System' },
  { id: 'LOG-3', timestamp: subHours(now, 3).toISOString(), user: 'Sub-Admin North', action: 'Assigned to self: Request #REQ-1001', ip: '10.0.4.12', role: 'Sub-Admin' },
  { id: 'LOG-4', timestamp: subHours(now, 5).toISOString(), user: 'Admin User 1', action: 'Updated System Settings', ip: '192.168.1.45', role: 'Admin' },
  { id: 'LOG-5', timestamp: subDays(now, 1).toISOString(), user: 'Admin User 1', action: 'Deactivated User #USR-003', ip: '192.168.1.45', role: 'Admin' },
];
