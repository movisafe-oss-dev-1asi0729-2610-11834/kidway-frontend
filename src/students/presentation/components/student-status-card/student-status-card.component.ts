import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { StudentEntity } from '../../../domain/entities/student.entity';

@Component({
  selector: 'kw-student-status-card',
  standalone: true,
  imports: [NgClass, MatIconModule, TranslateModule],
  templateUrl: './student-status-card.component.html',
  styleUrl: './student-status-card.component.css'
})
export class StudentStatusCardComponent {
  @Input({ required: true }) student!: StudentEntity;
  @Output() readonly viewRequested = new EventEmitter<StudentEntity>();

  get fullName(): string {
    return `${this.student.firstName} ${this.student.lastName}`;
  }

  get initials(): string {
    return `${this.student.firstName.charAt(0)}${this.student.lastName.charAt(0)}`.toUpperCase();
  }

  get assignmentLabel(): string {
    return this.student.routeName ?? 'studentsPage.unassignedRoute';
  }

  get attendanceWidth(): number {
    return Math.max(0, Math.min(100, this.student.attendanceRate));
  }

  openDetails(): void {
    this.viewRequested.emit(this.student);
  }
}
