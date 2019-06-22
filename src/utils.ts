import * as moment from 'moment';

export function formatDate(): string {
  return moment().format('YYYY-MM-DD HH:mm:ss');
}

export function formatUptime(uptime: number): string {
  const duration = moment.duration(uptime, 'seconds').asMilliseconds();
  return moment.utc(duration).format('HH:mm:ss');
}
