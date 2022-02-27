export interface INotification {
  level: NotificationLevel;
  title?: string;
  content: string;
}

export type NotificationOptions = Omit<INotification, 'level'>;

export class Notification implements INotification {
  private static _nextId = 0;

  public readonly id: number;
  public level: NotificationLevel;
  public title?: string;
  public content: string;
  public active: boolean;

  public constructor(level: NotificationLevel, options?: NotificationOptions) {
    this.id = Notification._nextId++;
    this.level = level;
    this.title = options?.title;
    this.content = options?.content;
    this.active = false;
  }
}

export enum NotificationLevel {
  SUCCESS = 'success',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error'
}

export const NOTIFICATION_COLOR_PER_LEVEL: {
  [key in NotificationLevel]: string;
} = {
  error: 'red',
  warning: '#f4d52e',
  info: '#5ccff2',
  success: '#31df00'
};
