export type CompanyStatus = 'active' | 'review' | 'pending' | 'suspended';
export type CompanyContractStatus = 'active' | 'renewal' | 'review' | 'paused';
export type CompanyMemberStatus = 'active' | 'invited' | 'inactive';
export type ComplianceStatus = 'completed' | 'pending' | 'review';
export type ComplianceSeverity = 'low' | 'medium' | 'high' | 'critical';
export type CompanyActivityStatus = 'completed' | 'active' | 'pending';

export interface CompanyProfileModel {
  id: string;
  legalName: string;
  commercialName: string;
  ruc: string;
  status: CompanyStatus;
  plan: string;
  planLimitVehicles: number;
  planLimitStudents: number;
  adminName: string;
  adminEmail: string;
  phone: string;
  address: string;
  operatingDistricts: string[];
  verified: boolean;
  licenseExpiration: string;
}

export interface CompanySummaryModel {
  activeCompanies: number;
  totalVehicles: number;
  activeDrivers: number;
  linkedSchools: number;
  managedStudents: number;
  complianceScore: number;
  serviceQualityScore: number;
  pendingReviews: number;
}

export interface SchoolContractModel {
  id: string;
  schoolName: string;
  district: string;
  routeCount: number;
  studentCount: number;
  contactName: string;
  renewalDate: string;
  status: CompanyContractStatus;
  score: number;
  notes: string;
}

export interface CompanyMemberModel {
  id: string;
  name: string;
  email: string;
  role: string;
  status: CompanyMemberStatus;
  lastAccess: string;
  scope: string;
}

export interface ComplianceItemModel {
  id: string;
  title: string;
  category: string;
  owner: string;
  dueDate: string;
  status: ComplianceStatus;
  severity: ComplianceSeverity;
  description: string;
}

export interface CompanyActivityModel {
  id: string;
  time: string;
  title: string;
  description: string;
  status: CompanyActivityStatus;
}

export interface CompanyManagementDashboardModel {
  profile: CompanyProfileModel;
  summary: CompanySummaryModel;
  contracts: SchoolContractModel[];
  members: CompanyMemberModel[];
  complianceItems: ComplianceItemModel[];
  activities: CompanyActivityModel[];
}
