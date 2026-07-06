export interface MaintenanceAlertModel {
  id: string;
  vehicleCode: string;
  plate: string;
  title: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  description: string;
}
