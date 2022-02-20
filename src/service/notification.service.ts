import Service from '../core/service';
import Notification, {
  NotificationLevel,
  NotificationOptions,
  NOTIFICATION_COLOR_PER_LEVEL
} from '../model/notification';

export type INotificationService = {
  maxOpened?: number;
};

export default class NotificationService
  extends Service
  implements INotificationService
{
  public maxOpened?: number;

  private _notificationElement: HTMLDivElement;
  private _map: Map<string, [Notification, HTMLSpanElement]>;
  private _active: number;

  public constructor(options: INotificationService = {}) {
    super();
    this._map = new Map();
    this._active = 0;
    this.maxOpened = options.maxOpened || 5;
  }

  success = (
    content: string,
    key?: string,
    options: Omit<NotificationOptions, 'content'> = {}
  ) => {
    this.pushNotification(NotificationLevel.SUCCESS, key ?? content, {
      ...options,
      content
    });
  };

  info = (
    content: string,
    key?: string,
    options: Omit<NotificationOptions, 'content'> = {}
  ) => {
    this.pushNotification(NotificationLevel.INFO, key ?? content, {
      ...options,
      content
    });
  };

  warning = (
    content: string,
    key?: string,
    options: Omit<NotificationOptions, 'content'> = {}
  ) => {
    this.pushNotification(NotificationLevel.WARNING, key ?? content, {
      ...options,
      content
    });
  };

  error = (
    content: string,
    key?: string,
    options: Omit<NotificationOptions, 'content'> = {}
  ) => {
    this.pushNotification(NotificationLevel.ERROR, key ?? content, {
      ...options,
      content
    });
  };

  clear = (key: string) => {
    if (!this._map.has(key)) return;
    const [notification, span] = this._map.get(key);
    span.remove();
    this._map.delete(key);
    if (notification.active) this._active--;
    if (this._active < this.maxOpened) {
      const found = [...this._map.values()].find(
        ([newNotification]) => !newNotification.active
      );
      if (found) this.showNotification(found[0], found[1]);
    }
  };

  private pushNotification(
    level: NotificationLevel,
    key: string,
    options?: NotificationOptions
  ) {
    if (!this._map.has(key)) {
      const notification = new Notification(level, options);
      const span = document.createElement('span');
      span.style.backgroundColor = NOTIFICATION_COLOR_PER_LEVEL[level];
      span.textContent = options.content;
      span.addEventListener('click', () => this.clear(key));
      this._map.set(key, [notification, span]);
      if (this._active < this.maxOpened) {
        this.showNotification(notification, span);
      }
    }
  }

  private showNotification(notification: Notification, span: HTMLSpanElement) {
    this._active++;
    this.notificationElement.appendChild(span);
    notification.active = true;
  }

  private get notificationElement() {
    if (!this._notificationElement) {
      this._notificationElement = <HTMLDivElement>(
        document.getElementById('notification')
      );
    }
    return this._notificationElement;
  }
}
