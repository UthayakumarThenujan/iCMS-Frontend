import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../../main-dashboard/components/user-profile/user-notification/notification.service';
import { interval,timer } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.scss']
})
export class TopMenuComponent implements OnInit {

  notifications: any[] = [];
  readNotifications: any[] = [];
  notificationCount: number = 0;
  ReadCount: number = 0;
  UnreadCount: number = 1;
  viewNotifications: boolean = false;
  Read: boolean = false;
  Unread: boolean = true;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.fetchNotifications();
    timer(0, 1200).subscribe(() => {
      if(this.Unread){
        this.fetchNotifications();
      }
      
    });
    this.NotificationsCount();
  }

  fetchNotifications() {
    this.notificationService.getNotifications().subscribe(
      (notifications) => {
        this.notifications = notifications;
        if (this.notificationCount === 0) {
          this.notifications = [{"alert":"No Notifications","email":"Empty"}];
        }
        this.Read = false;
        this.Unread = true;
      },
      (error) => {
        console.error('Error fetching notifications: ', error);
      }
    );
  }

  NotificationsCount() {
    interval(1000) // Fetch notification count every 1 second
      .pipe(
        startWith(0), // Emit initial value to trigger the first fetch immediately
        switchMap(() => this.notificationService.getNotifications())
      )
      .subscribe(
        (notifications) => {
          this.notificationCount = notifications.length;
        },
        (error) => {
          console.error('Error fetching notification count: ', error);
        }
      );
  }
  

  showNotifications() {
    this.viewNotifications = !this.viewNotifications;
    this.Read = false;
    this.Unread = true;
  }

  markAsRead(notificationIndex: number) {
    const readNotification = this.notifications.splice(notificationIndex, 1)[0];
    this.readNotifications.push(readNotification);
    if (this.notificationCount === 0) {
      this.notifications = [{"alert":"No Notifications","email":"Empty"}];
    }
    // Call the updateNotifications method with readNotifications
    this.notificationService.updateUnreadNotifications({"id": readNotification.id}).subscribe(
      (response) => {
        this.UnreadCount = 1;
        console.log('Notifications updated successfully:', response);
      },
      (error) => {
        console.error('Error updating notifications:', error);
      }
    );
  }

  markAsUnread(notificationIndex: number) {
    const ureadNotification = this.notifications.splice(notificationIndex, 1)[0];
    this.UnreadCount = this.notifications.length;
    if (this.notifications.length == 0) {
      this.notifications = [{"alert":"No Notifications","email":"Empty"}];
    }
    // Call the updateNotifications method with readNotifications
    this.notificationService.updateReadNotifications({"id": ureadNotification.id}).subscribe(
      (response) => {
        console.log('Notifications updated successfully:', response);
      },
      (error) => {
        console.error('Error updating notifications:', error);
      }
    );
  }

  ReadNotification() {
    this.notificationService.getReadNotifications().subscribe(
      (notifications) => {
        this.notifications = notifications;
        this.ReadCount = notifications.length;
        if (this.ReadCount === 0) {
          this.notifications = [{"alert":"No Notifications","email":"Empty"}];
        }
        this.Read = true;
        this.Unread = false;
      },
      (error) => {
        console.error('Error fetching notifications: ', error);
      }
    );
  }
}
