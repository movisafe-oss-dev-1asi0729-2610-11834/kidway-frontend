export type IncidentType = 'delay' | 'accident' | 'detour' | 'medical_emergency' | 'other';
export type IncidentStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export interface Incident {
    id: string;
    type: IncidentType;
    description: string;
    status: IncidentStatus;
    timestamp: Date;
    location: { lat: number; lng: number; address?: string };
    reportedBy: string; // driver id or name
    vehicleId?: string;
    stopId?: string;
    studentId?: string;
    attachments?: string[]; // URLs simuladas
    resolution?: string;
    resolvedAt?: Date;
}

export const IncidentTypeLabels: Record<IncidentType, string> = {
    delay: 'Retraso',
    accident: 'Accidente',
    detour: 'Desvío',
    medical_emergency: 'Emergencia médica',
    other: 'Otro'
};

export const IncidentStatusLabels: Record<IncidentStatus, string> = {
    open: 'Abierto',
    in_progress: 'En proceso',
    resolved: 'Resuelto',
    closed: 'Cerrado'
};