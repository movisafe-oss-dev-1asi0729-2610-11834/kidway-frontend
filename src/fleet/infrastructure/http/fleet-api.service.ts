import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, forkJoin, of } from 'rxjs';
import { VehicleEntity } from '../../domain/entities/vehicle.entity';
import { FleetDashboardModel } from '../../domain/models/fleet-dashboard.model';
import { FleetSummaryModel } from '../../domain/models/fleet-summary.model';
import { environment } from '../../../environments/environment';
import { MaintenanceAlertModel } from '../../domain/models/maintenance-alert.model';

const fallbackVehicles: VehicleEntity[] = [
  {
    id: 'veh-kw-204',
    plate: 'KW-204',
    code: 'KW-204',
    brand: 'Hyundai',
    model: 'H1 School Van',
    year: 2022,
    capacity: 18,
    assignedStudents: 16,
    driverName: 'Carlos Pérez',
    routeName: 'Miraflores School Route',
    status: 'onRoute',
    energyType: 'diesel',
    ownershipType: 'company',
    nextMaintenanceDate: '2026-07-18',
    lastInspectionDate: '2026-05-28',
    mileageKm: 48320,
    availabilityScore: 92,
    documentsValid: true
  },
  {
    id: 'veh-kw-118',
    plate: 'KW-118',
    code: 'KW-118',
    brand: 'Toyota',
    model: 'Hiace',
    year: 2021,
    capacity: 15,
    assignedStudents: 13,
    driverName: 'María Gómez',
    routeName: 'San Isidro Morning Route',
    status: 'available',
    energyType: 'gasoline',
    ownershipType: 'company',
    nextMaintenanceDate: '2026-08-05',
    lastInspectionDate: '2026-06-01',
    mileageKm: 39210,
    availabilityScore: 96,
    documentsValid: true
  },
  {
    id: 'veh-kw-076',
    plate: 'KW-076',
    code: 'KW-076',
    brand: 'Mercedes-Benz',
    model: 'Sprinter',
    year: 2020,
    capacity: 22,
    assignedStudents: 20,
    driverName: 'Luis Torres',
    routeName: 'Surco Pickup Route',
    status: 'maintenance',
    energyType: 'diesel',
    ownershipType: 'company',
    nextMaintenanceDate: '2026-07-08',
    lastInspectionDate: '2026-05-19',
    mileageKm: 58740,
    availabilityScore: 74,
    documentsValid: false
  },
  {
    id: 'veh-kw-311',
    plate: 'KW-311',
    code: 'KW-311',
    brand: 'Nissan',
    model: 'Urvan',
    year: 2023,
    capacity: 17,
    assignedStudents: 11,
    driverName: 'Andrea Rojas',
    routeName: 'La Molina Afternoon Route',
    status: 'available',
    energyType: 'gasoline',
    ownershipType: 'company',
    nextMaintenanceDate: '2026-09-11',
    lastInspectionDate: '2026-06-05',
    mileageKm: 25480,
    availabilityScore: 98,
    documentsValid: true
  }
];

const fallbackSummary: FleetSummaryModel = {
  totalVehicles: 25,
  availableVehicles: 22,
  onRouteVehicles: 12,
  maintenanceVehicles: 3,
  averageAvailability: 88,
  averageCapacityUsage: 83
};

const fallbackMaintenanceAlerts: MaintenanceAlertModel[] = [
  {
    id: 'maint-001',
    vehicleCode: 'KW-076',
    plate: 'KW-076',
    title: 'Technical inspection pending',
    dueDate: '2026-07-08',
    priority: 'high',
    description: 'Document validation is required before assigning this unit to a new route.'
  },
  {
    id: 'maint-002',
    vehicleCode: 'KW-204',
    plate: 'KW-204',
    title: 'Preventive maintenance scheduled',
    dueDate: '2026-07-18',
    priority: 'medium',
    description: 'Oil change and brake review should be confirmed this month.'
  }
];

@Injectable({ providedIn: 'root' })
export class FleetApiService {
  private readonly http = inject(HttpClient);

  getDashboard(): Observable<FleetDashboardModel> {
    return forkJoin({
      summary: this.http.get<FleetSummaryModel>(`${environment.apiBaseUrl}/fleetSummary`),
      vehicles: this.http.get<VehicleEntity[]>(`${environment.apiBaseUrl}/fleetVehicles`),
      maintenanceAlerts: this.http.get<MaintenanceAlertModel[]>(`${environment.apiBaseUrl}/fleetMaintenanceAlerts`)
    }).pipe(
      catchError(() =>
        of({
          summary: fallbackSummary,
          vehicles: fallbackVehicles,
          maintenanceAlerts: fallbackMaintenanceAlerts
        })
      )
    );
  }
  createVehicle(vehicle: VehicleEntity): Observable<VehicleEntity> {
    return this.http.post<VehicleEntity>(`${environment.apiBaseUrl}/fleetVehicles`, vehicle);
  }

  updateVehicle(vehicle: VehicleEntity): Observable<VehicleEntity> {
    return this.http.patch<VehicleEntity>(`${environment.apiBaseUrl}/fleetVehicles/${vehicle.id}`, vehicle);
  }

  deleteVehicle(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiBaseUrl}/fleetVehicles/${id}`);
  }

}
