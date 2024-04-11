import { Component } from '@angular/core';
import { NotificationService } from '../../../main-dashboard/components/user-profile/user-notification/notification.service';

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.scss']
})
export class TopMenuComponent {

  notifications: any[] = [];
  readNotifications: any[] = [];
  notificationCount: number = 0;
  viewNotifications: boolean = false; // Initialize viewNotifications to false
  Read: boolean= false;
  Unread : boolean=true;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.fetchNotifications();
  }

  fetchNotifications() {
    this.notificationService.getNotifications().subscribe(
      (notifications) => {
        this.notifications = notifications;
        this.notificationCount = notifications.length;
        if (this.notificationCount === 0) {
          this.notifications = [{"alert":"No Notifications","email":"Empty"}]; // Add this line
        }
        this.Read = false;
        this.Unread =true;
      },
      (error) => {
        console.error('Error fetching notifications: ', error);
      }

      
    );
  }

  showNotifications() {
    this.viewNotifications = !this.viewNotifications; // Toggle viewNotifications
  }

  markAsRead(notificationIndex: number) {
    const readNotification = this.notifications.splice(notificationIndex, 1)[0];
    this.readNotifications.push(readNotification);
    this.notificationCount--;
    console.log(readNotification.id);
    // Call the updateNotifications method with readNotifications
    this.notificationService.updateUnreadNotifications({"id": readNotification.id}).subscribe(
      (response) => {
        console.log('Notifications updated successfully:', response);
        // Clear readNotifications array after successful update if needed
        // this.readNotifications = [];
      },
      (error) => {
        console.error('Error updating notifications:', error);
      }
    );
  }

  markAsUnread(notificationIndex: number) {
    const ureadNotification = this.notifications.splice(notificationIndex, 1)[0];
    this.notificationCount++;
    console.log(ureadNotification.id);
    // Call the updateNotifications method with readNotifications
    this.notificationService.updateReadNotifications({"id": ureadNotification.id}).subscribe(
      (response) => {
        console.log('Notifications updated successfully:', response);
        // Clear readNotifications array after successful update if needed
        // this.readNotifications = [];
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
        this.Read = true;
        this.Unread =false;
      },
      (error) => {
        console.error('Error fetching notifications: ', error);
      }
    );
  }


}
