export type IncidentType =
  | 'delay'
  | 'route_deviation'
  | 'mechanical'
  | 'medical'
  | 'behavior'
  | 'safety'
  | 'other';

export type IncidentSeverity = 'critical' | 'high' | 'medium' | 'low';
export type IncidentStatus = 'reported' | 'in_review' | 'escalated' | 'resolved' | 'closed';

export interface IncidentRecord {
  id: string;
  code: string;
  title: string;
  description: string;
  type: IncidentType;
  severity: IncidentSeverity;
  status: IncidentStatus;
  routeName: string;
  vehiclePlate: string;
  driverName: string;
  schoolName: string;
  district: string;
  reportedBy: string;
  reportedAt: string;
  studentName?: string;
  evidenceCount: number;
  followUpRequired: boolean;
  resolution?: string;
  responseTimeMinutes: number;
}

export interface IncidentReview {
  id: string;
  title: string;
  description: string;
  severity: IncidentSeverity;
  incidentCode: string;
  dueDate: string;
}

export interface IncidentActivity {
  id: string;
  time: string;
  title: string;
  description: string;
  status: 'completed' | 'active' | 'pending';
}

export interface IncidentDashboardData {
  incidents: IncidentRecord[];
  reviews: IncidentReview[];
  activities: IncidentActivity[];
}

export interface IncidentSummary {
  total: number;
  open: number;
  critical: number;
  escalated: number;
  resolved: number;
  averageResponse: number;
  safetyScore: number;
}

export const INCIDENT_FALLBACK: IncidentDashboardData = {
  incidents: [
    {
      id: 'inc-001',
      code: 'INC-001',
      title: 'Minor incident follow-up',
      description: 'KW-204 reported a minor student boarding issue that requires company admin review.',
      type: 'behavior',
      severity: 'critical',
      status: 'escalated',
      routeName: 'Miraflores School Route',
      vehiclePlate: 'KW-204',
      driverName: 'Carlos Pérez',
      schoolName: 'Lima Norte School',
      district: 'Miraflores',
      reportedBy: 'Carlos Pérez',
      reportedAt: '2026-07-08T07:26:00',
      studentName: 'Maria Vega',
      evidenceCount: 2,
      followUpRequired: true,
      responseTimeMinutes: 18
    },
    {
      id: 'inc-002',
      code: 'INC-002',
      title: 'Route delay escalation',
      description: 'KW-118 exceeded the accepted delay threshold during the morning route.',
      type: 'delay',
      severity: 'high',
      status: 'in_review',
      routeName: 'San Isidro Morning Route',
      vehiclePlate: 'KW-118',
      driverName: 'María Gómez',
      schoolName: 'Santa Maria School',
      district: 'San Isidro',
      reportedBy: 'System monitor',
      reportedAt: '2026-07-08T07:43:00',
      evidenceCount: 1,
      followUpRequired: true,
      responseTimeMinutes: 12
    },
    {
      id: 'inc-003',
      code: 'INC-003',
      title: 'Mechanical inspection required',
      description: 'KW-076 stopped for an unscheduled mechanical inspection near Surco Pickup Route.',
      type: 'mechanical',
      severity: 'medium',
      status: 'reported',
      routeName: 'Surco Pickup Route',
      vehiclePlate: 'KW-076',
      driverName: 'Luis Torres',
      schoolName: 'Cambridge School',
      district: 'Santiago de Surco',
      reportedBy: 'Luis Torres',
      reportedAt: '2026-07-08T08:05:00',
      evidenceCount: 3,
      followUpRequired: true,
      responseTimeMinutes: 26
    },
    {
      id: 'inc-004',
      code: 'INC-004',
      title: 'Medical assistance completed',
      description: 'A student felt unwell during the afternoon service and was assisted following safety protocol.',
      type: 'medical',
      severity: 'high',
      status: 'resolved',
      routeName: 'La Molina Afternoon Route',
      vehiclePlate: 'KW-311',
      driverName: 'Andrea Rojas',
      schoolName: 'Newton College',
      district: 'La Molina',
      reportedBy: 'Andrea Rojas',
      reportedAt: '2026-07-07T16:20:00',
      studentName: 'Alonso Higa',
      evidenceCount: 1,
      followUpRequired: false,
      resolution: 'Guardian was notified and the student was safely delivered at destination.',
      responseTimeMinutes: 9
    },
    {
      id: 'inc-005',
      code: 'INC-005',
      title: 'Route deviation reviewed',
      description: 'A short route deviation was detected and reviewed after GPS synchronization.',
      type: 'route_deviation',
      severity: 'low',
      status: 'closed',
      routeName: 'San Isidro Morning Route',
      vehiclePlate: 'KW-118',
      driverName: 'María Gómez',
      schoolName: 'Santa Maria School',
      district: 'San Isidro',
      reportedBy: 'Tracking system',
      reportedAt: '2026-07-07T07:51:00',
      evidenceCount: 0,
      followUpRequired: false,
      resolution: 'Temporary traffic detour was accepted and recorded.',
      responseTimeMinutes: 7
    }
  ],
  reviews: [
    {
      id: 'review-001',
      title: 'Critical incident escalation',
      description: 'INC-001 requires company administrator follow-up before closing the operational day.',
      severity: 'critical',
      incidentCode: 'INC-001',
      dueDate: '2026-07-08'
    },
    {
      id: 'review-002',
      title: 'Delay report validation',
      description: 'INC-002 must be validated against tracking and attendance records.',
      severity: 'high',
      incidentCode: 'INC-002',
      dueDate: '2026-07-08'
    }
  ],
  activities: [
    {
      id: 'act-001',
      time: '8:10 AM',
      title: 'Incident escalation requested',
      description: 'INC-001 was escalated to company administration.',
      status: 'active'
    },
    {
      id: 'act-002',
      time: '7:45 AM',
      title: 'Delay evidence attached',
      description: 'Tracking evidence was linked to INC-002.',
      status: 'completed'
    },
    {
      id: 'act-003',
      time: '7:26 AM',
      title: 'Incident report created',
      description: 'KW-204 submitted a minor incident report.',
      status: 'completed'
    }
  ]
};
