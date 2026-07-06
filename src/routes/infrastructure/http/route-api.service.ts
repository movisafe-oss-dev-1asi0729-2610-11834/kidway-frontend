import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, forkJoin, of } from 'rxjs';
import { SchoolRouteEntity } from '../../domain/entities/school-route.entity';
import { RouteActivityModel } from '../../domain/models/route-activity.model';
import { RouteDashboardModel } from '../../domain/models/route-dashboard.model';
import { RouteReviewModel } from '../../domain/models/route-review.model';
import { RouteSummaryModel } from '../../domain/models/route-summary.model';

const fallbackSummary: RouteSummaryModel = {
  totalRoutes: 18,
  activeRoutes: 14,
  scheduledStops: 126,
  districtsCovered: 9,
  routeCoverage: 92,
  optimizationScore: 87
};

const fallbackRoutes: SchoolRouteEntity[] = [
  {
    id: 'route-001',
    code: 'RT-001',
    name: 'Miraflores School Route',
    district: 'Miraflores',
    school: 'Lima Norte School',
    scheduleLabel: 'Morning service',
    startTime: '06:45',
    endTime: '07:45',
    assignedDriver: 'Carlos Pérez',
    assignedVehicle: 'KW-204',
    assignedStudents: 16,
    vehicleCapacity: 18,
    stops: 12,
    coveragePercentage: 96,
    optimizationScore: 94,
    estimatedDuration: '58 min',
    status: 'active',
    nextServiceAt: '2026-07-06T06:45:00',
    lastOptimizedAt: '2026-07-04',
    needsOptimization: false,
    checkpoints: ['Av. Pardo', 'Óvalo Gutierrez', 'Colegio Lima Norte']
  },
  {
    id: 'route-002',
    code: 'RT-002',
    name: 'San Isidro Morning Route',
    district: 'San Isidro',
    school: 'Santa María School',
    scheduleLabel: 'Morning service',
    startTime: '06:50',
    endTime: '07:55',
    assignedDriver: 'María Gómez',
    assignedVehicle: 'KW-118',
    assignedStudents: 13,
    vehicleCapacity: 15,
    stops: 10,
    coveragePercentage: 91,
    optimizationScore: 88,
    estimatedDuration: '64 min',
    status: 'scheduled',
    nextServiceAt: '2026-07-06T06:50:00',
    lastOptimizedAt: '2026-07-03',
    needsOptimization: false,
    checkpoints: ['Javier Prado', 'Av. Salaverry', 'Santa María School']
  },
  {
    id: 'route-003',
    code: 'RT-003',
    name: 'Surco Pickup Route',
    district: 'Santiago de Surco',
    school: 'Cambridge School',
    scheduleLabel: 'Morning service',
    startTime: '06:35',
    endTime: '07:50',
    assignedDriver: 'Luis Torres',
    assignedVehicle: 'KW-076',
    assignedStudents: 20,
    vehicleCapacity: 22,
    stops: 15,
    coveragePercentage: 84,
    optimizationScore: 76,
    estimatedDuration: '75 min',
    status: 'review',
    nextServiceAt: '2026-07-06T06:35:00',
    lastOptimizedAt: '2026-06-28',
    needsOptimization: true,
    checkpoints: ['Caminos del Inca', 'Benavides', 'Cambridge School']
  },
  {
    id: 'route-004',
    code: 'RT-004',
    name: 'La Molina Afternoon Route',
    district: 'La Molina',
    school: 'Newton College',
    scheduleLabel: 'Afternoon return',
    startTime: '15:10',
    endTime: '16:15',
    assignedDriver: 'Andrea Rojas',
    assignedVehicle: 'KW-311',
    assignedStudents: 11,
    vehicleCapacity: 17,
    stops: 9,
    coveragePercentage: 94,
    optimizationScore: 91,
    estimatedDuration: '62 min',
    status: 'active',
    nextServiceAt: '2026-07-05T15:10:00',
    lastOptimizedAt: '2026-07-02',
    needsOptimization: false,
    checkpoints: ['Av. La Molina', 'Molicentro', 'Newton College']
  }
];

const fallbackReviews: RouteReviewModel[] = [
  {
    id: 'route-rev-001',
    routeCode: 'RT-003',
    routeName: 'Surco Pickup Route',
    title: 'Route optimization required',
    description: 'The route has exceeded the expected duration during the last three services.',
    dueDate: '2026-07-08',
    priority: 'high'
  },
  {
    id: 'route-rev-002',
    routeCode: 'RT-002',
    routeName: 'San Isidro Morning Route',
    title: 'Stop sequence review',
    description: 'Two stops can be reordered to reduce waiting time and fuel consumption.',
    dueDate: '2026-07-12',
    priority: 'medium'
  }
];

const fallbackActivities: RouteActivityModel[] = [
  {
    id: 'route-act-001',
    time: '6:45 AM',
    title: 'Route dispatch confirmed',
    description: 'RT-001 started with 16 assigned students and vehicle KW-204.',
    routeName: 'Miraflores School Route',
    status: 'completed'
  },
  {
    id: 'route-act-002',
    time: '7:12 AM',
    title: 'Coverage checkpoint updated',
    description: 'RT-002 confirmed the second checkpoint near Javier Prado.',
    routeName: 'San Isidro Morning Route',
    status: 'active'
  },
  {
    id: 'route-act-003',
    time: '8:05 AM',
    title: 'Optimization suggestion generated',
    description: 'RT-003 requires review due to accumulated delays and additional stops.',
    routeName: 'Surco Pickup Route',
    status: 'pending'
  }
];

@Injectable({ providedIn: 'root' })
export class RouteApiService {
  private readonly http = inject(HttpClient);

  getDashboard(): Observable<RouteDashboardModel> {
    return forkJoin({
      summary: this.http.get<RouteSummaryModel>('/api/routeSummary'),
      routes: this.http.get<SchoolRouteEntity[]>('/api/schoolRoutes'),
      reviews: this.http.get<RouteReviewModel[]>('/api/routeReviews'),
      activities: this.http.get<RouteActivityModel[]>('/api/routeActivities')
    }).pipe(
      catchError(() =>
        of({
          summary: fallbackSummary,
          routes: fallbackRoutes,
          reviews: fallbackReviews,
          activities: fallbackActivities
        })
      )
    );
  }
}
