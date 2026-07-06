import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { TripDashboardModel } from '../../domain/models/trip-dashboard.model';
import { TripAssembler } from '../trip-assembler';
import { TripsApiResponse } from '../trips-api';

@Injectable({ providedIn: 'root' })
export class TripApiService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = '/api/tripDashboard';

  getDashboard(): Observable<TripDashboardModel> {
    return this.http.get<TripsApiResponse>(this.endpoint).pipe(
      map((response) => TripAssembler.toDashboard(response)),
      catchError(() => of(this.fallbackDashboard()))
    );
  }

  private fallbackDashboard(): TripDashboardModel {
    return {
      summary: {
        totalTrips: 18,
        activeTrips: 5,
        scheduledTrips: 7,
        delayedTrips: 2,
        completedTrips: 11,
        serviceReliability: 93
      },
      trips: [
        {
          id: 'trip-001',
          code: 'TP-001',
          routeName: 'Miraflores School Route',
          vehiclePlate: 'KW-204',
          driverName: 'Carlos Pérez',
          school: 'Lima Norte School',
          district: 'Miraflores',
          shift: 'morning',
          status: 'in_progress',
          students: 16,
          capacity: 18,
          startTime: '06:45',
          estimatedEndTime: '07:45',
          nextStop: 'Calle Pino 42',
          completedStops: 8,
          totalStops: 12,
          progress: 84,
          averageSpeed: 31.4,
          attendanceRate: 98,
          incidents: 0,
          trackingStatus: 'enabled',
          validationMessage: 'Trip running with confirmed attendance and live tracking.',
          updatedAt: 'Today, 7:45 AM'
        },
        {
          id: 'trip-002',
          code: 'TP-002',
          routeName: 'San Isidro Morning Route',
          vehiclePlate: 'KW-118',
          driverName: 'María Gómez',
          school: 'Santa María School',
          district: 'San Isidro',
          shift: 'morning',
          status: 'delayed',
          students: 13,
          capacity: 15,
          startTime: '06:50',
          estimatedEndTime: '07:55',
          nextStop: 'Av. Robles 115',
          completedStops: 6,
          totalStops: 10,
          progress: 61,
          averageSpeed: 18.6,
          attendanceRate: 95,
          incidents: 1,
          trackingStatus: 'enabled',
          validationMessage: 'Delay detected after ETA recalculation.',
          updatedAt: 'Today, 7:43 AM'
        },
        {
          id: 'trip-003',
          code: 'TP-003',
          routeName: 'Surco Pickup Route',
          vehiclePlate: 'KW-076',
          driverName: 'Luis Torres',
          school: 'Cambridge School',
          district: 'Surco',
          shift: 'morning',
          status: 'scheduled',
          students: 20,
          capacity: 22,
          startTime: '07:05',
          estimatedEndTime: '08:10',
          nextStop: 'Javier Prado checkpoint',
          completedStops: 0,
          totalStops: 15,
          progress: 0,
          averageSpeed: 0,
          attendanceRate: 0,
          incidents: 0,
          trackingStatus: 'ready',
          validationMessage: 'Ready to start after attendance checklist.',
          updatedAt: 'Today, 7:20 AM'
        },
        {
          id: 'trip-004',
          code: 'TP-004',
          routeName: 'La Molina Afternoon Route',
          vehiclePlate: 'KW-311',
          driverName: 'Andrea Rojas',
          school: 'Newton College',
          district: 'La Molina',
          shift: 'afternoon',
          status: 'completed',
          students: 11,
          capacity: 17,
          startTime: '15:05',
          estimatedEndTime: '16:05',
          actualEndTime: '16:01',
          nextStop: 'Completed',
          completedStops: 9,
          totalStops: 9,
          progress: 100,
          averageSpeed: 34.1,
          attendanceRate: 100,
          incidents: 0,
          trackingStatus: 'closed',
          validationMessage: 'Trip completed without incidents.',
          updatedAt: 'Yesterday, 4:01 PM'
        }
      ],
      reviews: [
        {
          id: 'trip-review-001',
          title: 'Delay follow-up required',
          description: 'KW-118 exceeded the accepted delay threshold during the morning route.',
          severity: 'high',
          tripCode: 'TP-002',
          dueDate: '2026-07-08'
        },
        {
          id: 'trip-review-002',
          title: 'Start checklist pending',
          description: 'Surco Pickup Route still needs final attendance confirmation before departure.',
          severity: 'medium',
          tripCode: 'TP-003',
          dueDate: '2026-07-09'
        }
      ],
      activities: [
        {
          id: 'trip-activity-001',
          time: '7:45 AM',
          title: 'Trip progress updated',
          description: 'Miraflores School Route reached 84% completion.',
          status: 'active'
        },
        {
          id: 'trip-activity-002',
          time: '7:43 AM',
          title: 'Delay alert generated',
          description: 'San Isidro Morning Route was marked as delayed after ETA recalculation.',
          status: 'pending'
        },
        {
          id: 'trip-activity-003',
          time: '7:20 AM',
          title: 'Scheduled trip ready',
          description: 'Surco Pickup Route is ready to start after validation.',
          status: 'completed'
        }
      ]
    };
  }
}
