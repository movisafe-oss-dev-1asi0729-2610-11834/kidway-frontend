export interface AttendanceSummaryModel {
  totalAssigned: number;
  onBoard: number;
  arrived: number;
  waiting: number;
  absent: number;
  pendingConfirmation: number;
  attendanceReliability: number;
}
