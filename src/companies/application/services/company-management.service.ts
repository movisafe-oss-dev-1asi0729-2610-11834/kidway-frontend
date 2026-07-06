import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, of } from 'rxjs';
import {
  CompanyActivityModel,
  CompanyContractStatus,
  CompanyManagementDashboardModel,
  CompanyMemberStatus,
  ComplianceStatus,
  SchoolContractModel
} from '../../domain/models/company-management.model';
import { CompanyManagementHttpService } from '../../infrastructure/http/company-management-http.service';

export const COMPANY_MANAGEMENT_FALLBACK: CompanyManagementDashboardModel = {
  profile: {
    id: 'cmp-001',
    legalName: 'MoviSafe School Transport S.A.C.',
    commercialName: 'KidWay Lima Norte',
    ruc: '20609876541',
    status: 'active',
    plan: 'Company Pro',
    planLimitVehicles: 30,
    planLimitStudents: 500,
    adminName: 'Dr. Maria Lopez',
    adminEmail: 'maria.lopez@kidway.pe',
    phone: '+51 987 654 321',
    address: 'Av. Javier Prado 1245, San Isidro, Lima',
    operatingDistricts: ['Miraflores', 'San Isidro', 'Surco', 'La Molina', 'San Borja'],
    verified: true,
    licenseExpiration: '2026-12-20'
  },
  summary: {
    activeCompanies: 1,
    totalVehicles: 25,
    activeDrivers: 18,
    linkedSchools: 6,
    managedStudents: 248,
    complianceScore: 94,
    serviceQualityScore: 93,
    pendingReviews: 3
  },
  contracts: [
    {
      id: 'school-001',
      schoolName: 'Lima Norte School',
      district: 'Miraflores',
      routeCount: 4,
      studentCount: 86,
      contactName: 'Rosa Arana',
      renewalDate: '2026-11-30',
      status: 'active',
      score: 97,
      notes: 'Priority contract with morning and afternoon coverage.'
    },
    {
      id: 'school-002',
      schoolName: 'Santa Maria School',
      district: 'San Isidro',
      routeCount: 3,
      studentCount: 71,
      contactName: 'Luis Mendoza',
      renewalDate: '2026-09-18',
      status: 'renewal',
      score: 89,
      notes: 'Renewal documents must be confirmed before the next billing cycle.'
    },
    {
      id: 'school-003',
      schoolName: 'Cambridge School',
      district: 'Surco',
      routeCount: 2,
      studentCount: 45,
      contactName: 'Diana Chávez',
      renewalDate: '2026-07-22',
      status: 'review',
      score: 82,
      notes: 'Route capacity needs review due to recurring pickup delays.'
    },
    {
      id: 'school-004',
      schoolName: 'Newton College',
      district: 'La Molina',
      routeCount: 2,
      studentCount: 46,
      contactName: 'Alonso Salazar',
      renewalDate: '2027-01-14',
      status: 'active',
      score: 95,
      notes: 'Stable contract with excellent punctuality indicators.'
    }
  ],
  members: [
    { id: 'member-001', name: 'Maria Lopez', email: 'maria.lopez@kidway.pe', role: 'Company Admin', status: 'active', lastAccess: 'Today, 8:12 AM', scope: 'Full company management' },
    { id: 'member-002', name: 'Carlos Perez', email: 'carlos.perez@kidway.pe', role: 'Operations Coordinator', status: 'active', lastAccess: 'Today, 7:50 AM', scope: 'Routes, drivers and incidents' },
    { id: 'member-003', name: 'Andrea Rojas', email: 'andrea.rojas@kidway.pe', role: 'Fleet Supervisor', status: 'active', lastAccess: 'Yesterday, 6:40 PM', scope: 'Vehicles and maintenance' },
    { id: 'member-004', name: 'Luis Torres', email: 'luis.torres@kidway.pe', role: 'Company Driver', status: 'invited', lastAccess: 'Pending invitation', scope: 'Assigned trips only' }
  ],
  complianceItems: [
    { id: 'cmp-review-001', title: 'Transport authorization renewal', category: 'Legal', owner: 'Company Admin', dueDate: '2026-07-18', status: 'pending', severity: 'high', description: 'Upload the updated municipal authorization for all active routes.' },
    { id: 'cmp-review-002', title: 'School contract evidence', category: 'Contracts', owner: 'Operations Coordinator', dueDate: '2026-07-25', status: 'review', severity: 'medium', description: 'Confirm signed contract evidence for Santa Maria School renewal.' },
    { id: 'cmp-review-003', title: 'Driver access audit', category: 'Security', owner: 'Company Admin', dueDate: '2026-08-02', status: 'completed', severity: 'low', description: 'Quarterly access validation completed for active drivers.' }
  ],
  activities: [
    { id: 'act-001', time: '8:15 AM', title: 'Company profile verified', description: 'Business data and contact information were confirmed.', status: 'completed' },
    { id: 'act-002', time: '7:45 AM', title: 'School contract flagged for renewal', description: 'Santa Maria School requires contract evidence validation.', status: 'pending' },
    { id: 'act-003', time: '7:20 AM', title: 'Operations team synchronized', description: 'Fleet and route supervisors confirmed daily operating scope.', status: 'active' }
  ]
};

@Injectable({ providedIn: 'root' })
export class CompanyManagementService {
  private readonly api = inject(CompanyManagementHttpService);

  readonly dashboard = signal<CompanyManagementDashboardModel>(COMPANY_MANAGEMENT_FALLBACK);
  readonly query = signal('');
  readonly contractStatus = signal<CompanyContractStatus | 'all'>('all');
  readonly memberStatus = signal<CompanyMemberStatus | 'all'>('all');
  readonly complianceStatus = signal<ComplianceStatus | 'all'>('all');
  readonly selectedContractId = signal(COMPANY_MANAGEMENT_FALLBACK.contracts[0].id);
  readonly selectedMemberId = signal(COMPANY_MANAGEMENT_FALLBACK.members[0].id);

  readonly profile = computed(() => this.dashboard().profile);
  readonly summary = computed(() => this.dashboard().summary);

  readonly filteredContracts = computed(() => {
    const query = this.query().trim().toLowerCase();
    const status = this.contractStatus();
    return this.dashboard().contracts.filter((contract) => {
      const matchesStatus = status === 'all' || contract.status === status;
      const matchesQuery = !query || [contract.schoolName, contract.district, contract.contactName, contract.status, contract.notes].some((value) => value.toLowerCase().includes(query));
      return matchesStatus && matchesQuery;
    });
  });

  readonly selectedContract = computed<SchoolContractModel>(() => {
    return this.dashboard().contracts.find((contract) => contract.id === this.selectedContractId()) ?? this.dashboard().contracts[0];
  });

  readonly filteredMembers = computed(() => {
    const status = this.memberStatus();
    return this.dashboard().members.filter((member) => status === 'all' || member.status === status);
  });

  readonly selectedMember = computed(() => {
    return this.dashboard().members.find((member) => member.id === this.selectedMemberId()) ?? this.dashboard().members[0];
  });

  readonly filteredCompliance = computed(() => {
    const status = this.complianceStatus();
    return this.dashboard().complianceItems.filter((item) => status === 'all' || item.status === status);
  });

  constructor() {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.api.getDashboard().pipe(catchError(() => of(COMPANY_MANAGEMENT_FALLBACK))).subscribe((dashboard) => {
      this.dashboard.set(dashboard);
      this.selectedContractId.set(dashboard.contracts[0]?.id ?? '');
      this.selectedMemberId.set(dashboard.members[0]?.id ?? '');
    });
  }

  selectContract(contractId: string): void {
    this.selectedContractId.set(contractId);
  }

  selectMember(memberId: string): void {
    this.selectedMemberId.set(memberId);
  }

  setContractStatus(status: CompanyContractStatus | 'all'): void {
    this.contractStatus.set(status);
  }

  setMemberStatus(status: CompanyMemberStatus | 'all'): void {
    this.memberStatus.set(status);
  }

  setComplianceStatus(status: ComplianceStatus | 'all'): void {
    this.complianceStatus.set(status);
  }

  markComplianceCompleted(itemId: string): void {
    const now = new Date();
    const nextActivity: CompanyActivityModel = {
      id: `act-${Date.now()}`,
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title: 'Compliance item completed',
      description: 'A company management review was marked as completed in the mock state.',
      status: 'completed'
    };

    this.dashboard.update((dashboard) => ({
      ...dashboard,
      summary: {
        ...dashboard.summary,
        pendingReviews: Math.max(0, dashboard.summary.pendingReviews - 1),
        complianceScore: Math.min(100, dashboard.summary.complianceScore + 1)
      },
      complianceItems: dashboard.complianceItems.map((item) => item.id === itemId ? { ...item, status: 'completed', severity: 'low' } : item),
      activities: [nextActivity, ...dashboard.activities]
    }));
  }

  exportCsv(): void {
    const headers = ['School', 'District', 'Routes', 'Students', 'Status', 'Renewal date', 'Score'];
    const rows = this.dashboard().contracts.map((contract) => [
      contract.schoolName,
      contract.district,
      String(contract.routeCount),
      String(contract.studentCount),
      contract.status,
      contract.renewalDate,
      `${contract.score}%`
    ]);
    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'kidway-company-contracts.csv';
    link.click();
    URL.revokeObjectURL(url);
  }

  contractStatusLabel(status: CompanyContractStatus): string {
    return `companiesBc.status.contract.${status}`;
  }

  memberStatusLabel(status: CompanyMemberStatus): string {
    return `companiesBc.status.member.${status}`;
  }

  complianceStatusLabel(status: ComplianceStatus): string {
    return `companiesBc.status.compliance.${status}`;
  }
}
