import { StudentStatus } from '../models/student-status.type';

export interface StudentEntity {
  id: string;
  code: string;
  firstName: string;
  lastName: string;
  grade: string;
  school: string;
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  emergencyContact: string;
  routeName: string | null;
  routeCode: string | null;
  assignedVehicle: string | null;
  assignedDriver: string | null;
  pickupPoint: string | null;
  dropOffPoint: string | null;
  pickupWindow: string | null;
  authorizationStatus: 'verified' | 'pending' | 'expired';
  attendanceRate: number;
  lastAttendanceStatus: 'boarded' | 'droppedOff' | 'absent' | 'pending';
  status: StudentStatus;
  notes: string;
}

/**
 * Legacy class kept for compatibility with the previous student components.
 * The new 8BC view uses StudentEntity, but this export prevents old unused files
 * from breaking strict TypeScript compilation while the codebase is being migrated.
 */
export class Student {
  private _id: number;
  private _code: string;
  private _firstName: string;
  private _lastName: string;
  private _grade: string;
  private _tutorName: string;
  private _tutorContact: string;
  private _routeAssigned: string | null;
  private _stopName: string | null;
  private _status: 'Activo' | 'Sin ruta' | 'Inactivo';

  constructor(props: {
    id: number;
    code: string;
    firstName: string;
    lastName: string;
    grade: string;
    tutorName: string;
    tutorContact: string;
    routeAssigned: string | null;
    stopName: string | null;
    status: 'Activo' | 'Sin ruta' | 'Inactivo';
  }) {
    this._id = props.id;
    this._code = props.code;
    this._firstName = props.firstName;
    this._lastName = props.lastName;
    this._grade = props.grade;
    this._tutorName = props.tutorName;
    this._tutorContact = props.tutorContact;
    this._routeAssigned = props.routeAssigned;
    this._stopName = props.stopName;
    this._status = props.status;
  }

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }
  get code(): string { return this._code; }
  get firstName(): string { return this._firstName; }
  get lastName(): string { return this._lastName; }
  get grade(): string { return this._grade; }
  get tutorName(): string { return this._tutorName; }
  get tutorContact(): string { return this._tutorContact; }
  get routeAssigned(): string | null { return this._routeAssigned; }
  get stopName(): string | null { return this._stopName; }
  get status(): string { return this._status; }

  get initials(): string {
    return `${this._firstName.charAt(0)}${this._lastName.charAt(0)}`.toUpperCase();
  }

  get fullName(): string {
    return `${this._firstName} ${this._lastName}`;
  }
}
