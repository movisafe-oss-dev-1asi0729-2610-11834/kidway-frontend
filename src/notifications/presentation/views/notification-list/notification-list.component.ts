import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NotificationService } from '../../../application/services/notification.service';
import { AppNotification } from '../../../domain/models/notification.model';

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="notif-container">
      <div class="notif-header">
        <h2>{{ 'notifications.title' | translate }}</h2>
        <span class="unread-count">3 Nuevas</span>
      </div>

      <div class="notif-list">
        @for (item of notifications; track item.id) {
          <div class="notif-item" [ngClass]="{'unread': !item.isRead}">
            <div class="notif-icon" [ngClass]="item.type">
              @if(item.type === 'danger') { 🚨 }
              @else if(item.type === 'warning') { ⚠️ }
              @else { 📧 }
            </div>
            <div class="notif-content">
              <div class="notif-top">
                <strong>{{ item.title }}</strong>
                <span class="time">{{ item.timestamp | date:'shortTime' }}</span>
              </div>
              <p>{{ item.message }}</p>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .notif-container { padding: 2rem; max-width: 800px; margin: 0 auto; }
    .notif-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .unread-count { background: #ee5d50; color: white; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: bold; }
    
    .notif-list { display: flex; flex-direction: column; gap: 1rem; }
    .notif-item { 
      display: flex; gap: 15px; background: white; padding: 1.2rem; 
      border-radius: 16px; border: 1px solid #e2e8f0; transition: 0.2s;
    }
    .notif-item.unread { border-left: 5px solid #4318ff; background: #f8faff; }
    .notif-item:hover { transform: scale(1.01); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }

    .notif-icon { 
      width: 45px; height: 45px; border-radius: 12px; display: flex; 
      align-items: center; justify-content: center; font-size: 1.2rem;
    }
    .notif-icon.danger { background: #ffeeed; color: #ee5d50; }
    .notif-icon.warning { background: #fff8eb; color: #ffa800; }
    .notif-icon.info { background: #eef0ff; color: #4318ff; }

    .notif-content { flex: 1; }
    .notif-top { display: flex; justify-content: space-between; margin-bottom: 4px; }
    .notif-top strong { color: #1b254b; }
    .time { font-size: 0.75rem; color: #a3aed0; }
    p { margin: 0; color: #4a5568; font-size: 0.9rem; }
  `]
})
export class NotificationListComponent implements OnInit {
  notifications: AppNotification[] = [];
  constructor(private notifService: NotificationService) {}
  ngOnInit() { this.notifService.getAll().subscribe(data => this.notifications = data); }
}