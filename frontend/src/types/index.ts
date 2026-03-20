export type UserRole = 'admin' | 'organization';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export type OrgType = 'NGO' | 'Temple' | 'Trust' | 'Education' | 'Health' | 'Food' | 'Other';
export type OrgStatus = 'pending' | 'approved' | 'rejected';

export interface Organization {
  _id: string;
  name: string;
  type: OrgType;
  description: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  contactEmail: string;
  phone: string;
  logo?: string;
  images: string[];
  razorpayAccountId?: string;
  razorpayKeyId?: string;
  status: OrgStatus;
  isVerified: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface PaginatedOrganizations {
  organizations: Organization[];
  pagination: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}

export interface AdminStats {
  totalOrgs: number;
  pendingOrgs: number;
  approvedOrgs: number;
  verifiedOrgs: number;
  totalUsers: number;
  totalDonations: number;
}
