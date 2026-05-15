import { BaseEntity } from "../../../shared/infrastructure/base-entity";

export class Assignment implements BaseEntity {
    private _id: number;
    private _studentName: string;
    private _studentId: string;
    private _routeName: string;
    private _vehiclePlate: string;
    private _shift: 'Morning' | 'Afternoon';
    private _status: 'Active' | 'Inactive';
    private _tutorName: string;

    constructor(props: {
        id: number;
        studentName: string;
        studentId: string;
        routeName: string;
        vehiclePlate: string;
        shift: 'Morning' | 'Afternoon';
        status: 'Active' | 'Inactive';
        tutorName: string;
    }) {
        this._id = props.id;
        this._studentName = props.studentName;
        this._studentId = props.studentId;
        this._routeName = props.routeName;
        this._vehiclePlate = props.vehiclePlate;
        this._shift = props.shift;
        this._status = props.status;
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

    get routeName(): string {
        return this._routeName;
    }

    get vehiclePlate(): string {
        return this._vehiclePlate;
    }

    get shift(): string {
        return this._shift;
    }

    get status(): string {
        return this._status;
    }

    get tutorName(): string {
        return this._tutorName;
    }
}