import { BaseEntity } from "../../../shared/infrastructure/base-entity";

export class Attendance implements BaseEntity {
    private _id: number;
    private _studentName: string;
    private _studentId: string;
    private _initials: string;
    private _routeName: string;
    private _vehiclePlate: string;
    private _status: 'On board' | 'Boarded' | 'Absent' | 'Waiting';
    private _checkInTime: string | null;
    private _estimatedArrival: string | null;
    private _tutorName: string;

    constructor(props: {
        id: number;
        studentName: string;
        studentId: string;
        initials: string;
        routeName: string;
        vehiclePlate: string;
        status: 'On board' | 'Boarded' | 'Absent' | 'Waiting';
        checkInTime: string | null;
        estimatedArrival: string | null;
        tutorName: string;
    }) {
        this._id = props.id;
        this._studentName = props.studentName;
        this._studentId = props.studentId;
        this._initials = props.initials;
        this._routeName = props.routeName;
        this._vehiclePlate = props.vehiclePlate;
        this._status = props.status;
        this._checkInTime = props.checkInTime;
        this._estimatedArrival = props.estimatedArrival;
        this._tutorName = props.tutorName;
    }

    get id(): number {
        return this._id;
    }

    get studentName(): string {
        return this._studentName;
    }

    get studentId(): string {
        return this._studentId;
    }

    get initials(): string {
        return this._initials;
    }

    get routeName(): string {
        return this._routeName;
    }

    get vehiclePlate(): string {
        return this._vehiclePlate;
    }

    get status(): string {
        return this._status;
    }

    get checkInTime(): string | null {
        return this._checkInTime;
    }

    get estimatedArrival(): string | null {
        return this._estimatedArrival;
    }

    get tutorName(): string {
        return this._tutorName;
    }
}