import { AssignmentEntity } from '../entities/assignment.entity';
import { AssignmentReviewModel } from './assignment-review.model';
import { AssignmentActivityModel } from './assignment-activity.model';

export interface AssignmentSummaryModel {
  totalAssignments: number;
  validatedAssignments: number;
  pendingAssignments: number;
  conflictsDetected: number;
  averageCapacity: number;
  assignmentReadiness: number;
}

export interface AssignmentDashboardModel {
  summary: AssignmentSummaryModel;
  assignments: AssignmentEntity[];
  reviews: AssignmentReviewModel[];
  activities: AssignmentActivityModel[];
}

export const FALLBACK_ASSIGNMENT_DASHBOARD: AssignmentDashboardModel = {
  summary: {
    totalAssignments: 24,
    validatedAssignments: 19,
    pendingAssignments: 3,
    conflictsDetected: 2,
    averageCapacity: 84,
    assignmentReadiness: 91
  },
  assignments: [
    {
      id: 'AS-001',
      studentCode: 'ST-001',
      studentName: 'María Vega',
      grade: '4th Grade',
      guardianName: 'María López',
      routeCode: 'RT-001',
      routeName: 'Miraflores School Route',
      vehiclePlate: 'KW-204',
      driverName: 'Carlos Pérez',
      shift: 'morning',
      pickupPoint: 'Calle Pino 42',
      pickupWindow: '06:45 - 06:55',
      capacityUsage: 89,
      validationScore: 98,
      validation: 'ready',
      status: 'validated',
      lastUpdated: 'Today, 7:08 AM',
      notes: 'Student assigned to active route and confirmed guardian record.'
    },
    {
      id: 'AS-002',
      studentCode: 'ST-002',
      studentName: 'Diego Ruiz',
      grade: '5th Grade',
      guardianName: 'Juan Ruiz',
      routeCode: 'RT-002',
      routeName: 'San Isidro Morning Route',
      vehiclePlate: 'KW-118',
      driverName: 'María Gómez',
      shift: 'morning',
      pickupPoint: 'Av. Robles 115',
      pickupWindow: '06:50 - 07:00',
      capacityUsage: 87,
      validationScore: 95,
      validation: 'ready',
      status: 'validated',
      lastUpdated: 'Today, 7:18 AM',
      notes: 'Assignment confirmed for morning service.'
    },
    {
      id: 'AS-003',
      studentCode: 'ST-003',
      studentName: 'Valeria Cruz',
      grade: '1st Secondary',
      guardianName: 'Elena Cruz',
      routeCode: 'RT-003',
      routeName: 'Surco Pickup Route',
      vehiclePlate: 'KW-076',
      driverName: 'Luis Torres',
      shift: 'morning',
      pickupPoint: 'Javier Prado checkpoint',
      pickupWindow: '07:05 - 07:15',
      capacityUsage: 91,
      validationScore: 76,
      validation: 'schedule-conflict',
      status: 'conflict',
      lastUpdated: 'Today, 8:02 AM',
      notes: 'Pickup window overlaps with another planned stop.'
    },
    {
      id: 'AS-004',
      studentCode: 'ST-004',
      studentName: 'Mateo Lara',
      grade: '2nd Grade',
      guardianName: 'Rosa Lara',
      routeCode: 'RT-001',
      routeName: 'Miraflores School Route',
      vehiclePlate: 'KW-204',
      driverName: 'Carlos Pérez',
      shift: 'afternoon',
      pickupPoint: 'Plaza Norte',
      pickupWindow: '15:05 - 15:15',
      capacityUsage: 91,
      validationScore: 92,
      validation: 'ready',
      status: 'validated',
      lastUpdated: 'Today, 3:05 PM',
      notes: 'Afternoon assignment ready for return service.'
    },
    {
      id: 'AS-005',
      studentCode: 'ST-005',
      studentName: 'Ana Méndez',
      grade: '4th Grade',
      guardianName: 'Carlos Méndez',
      routeCode: 'RT-002',
      routeName: 'San Isidro Morning Route',
      vehiclePlate: 'KW-118',
      driverName: 'María Gómez',
      shift: 'morning',
      pickupPoint: 'Col. Las Flores',
      pickupWindow: '06:55 - 07:05',
      capacityUsage: 87,
      validationScore: 94,
      validation: 'ready',
      status: 'validated',
      lastUpdated: 'Today, 7:22 AM',
      notes: 'Assignment verified and synchronized with route planning.'
    },
    {
      id: 'AS-006',
      studentCode: 'ST-006',
      studentName: 'Alonso Higa',
      grade: '1st Grade',
      guardianName: 'Jorge Higa',
      routeCode: 'RT-PENDING',
      routeName: 'Route not assigned',
      vehiclePlate: 'Pending',
      driverName: 'Pending',
      shift: 'morning',
      pickupPoint: 'Not assigned',
      pickupWindow: 'Pending',
      capacityUsage: 0,
      validationScore: 0,
      validation: 'missing-route',
      status: 'pending',
      lastUpdated: 'Today, 8:15 AM',
      notes: 'Needs route, vehicle and driver assignment before daily trip.'
    }
  ],
  reviews: [
    {
      id: 'AR-001',
      title: 'Schedule conflict detected',
      description: 'Valeria Cruz pickup window overlaps with another planned stop in Surco Pickup Route.',
      assignmentCode: 'AS-003 · Valeria Cruz · 2026-07-08',
      severity: 'high',
      dueDate: '2026-07-08'
    },
    {
      id: 'AR-002',
      title: 'Route assignment pending',
      description: 'Alonso Higa needs an assigned route, vehicle and driver before morning service.',
      assignmentCode: 'AS-006 · Alonso Higa · 2026-07-10',
      severity: 'medium',
      dueDate: '2026-07-10'
    }
  ],
  activities: [
    {
      id: 'AA-001',
      time: '7:08 AM · María Vega',
      title: 'Assignment validated',
      description: 'María Vega was assigned to Miraflores School Route with vehicle KW-204.',
      status: 'completed'
    },
    {
      id: 'AA-002',
      time: '7:18 AM · Diego Ruiz',
      title: 'Route capacity confirmed',
      description: 'San Isidro Morning Route still has available capacity after assignment update.',
      status: 'active'
    },
    {
      id: 'AA-003',
      time: '8:15 AM · Alonso Higa',
      title: 'Assignment review required',
      description: 'The student is still pending route and vehicle assignment.',
      status: 'pending'
    }
  ]
};
