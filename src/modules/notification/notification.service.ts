import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import * as fs from 'fs';
import { TimeEnum } from 'src/utils/enums';

@Injectable()
export class NotificationService {
  constructor(private readonly schedulerRegistry: SchedulerRegistry) {}

  async createCronNotification(
    appointment_id: string,
    userName: string,
    doctorSpec: string,
    appointmentDate: Date,
  ) {
    const date24h = new Date(appointmentDate);
    date24h.setDate(date24h.getDate() - 1);
    const date2h = new Date(appointmentDate);
    date2h.setTime(date2h.getTime() - 2 * 60 * 60 * 1000);

    const job2h = new CronJob(date2h, () => {
      this.addMessage(
        userName,
        doctorSpec,
        appointmentDate,
        TimeEnum.TWO_HOURS,
      );
    });
    const job24h = new CronJob(date24h, () => {
      this.addMessage(
        userName,
        doctorSpec,
        appointmentDate,
        TimeEnum.TWENTY_FOUR_HOURS,
      );
    });

    this.schedulerRegistry.addCronJob(
      `${Date.now()}-2h-${userName}-${appointment_id}`,
      job2h,
    );
    job2h.start();
    this.schedulerRegistry.addCronJob(
      `${Date.now()}-24h-${userName}-${appointment_id}`,
      job24h,
    );
    job24h.start();

    return 'Notification was added';
  }

  private async addMessage(
    userName: string,
    doctorSpec: string,
    appointmentDate: Date,
    type: TimeEnum,
  ) {
    const message2h = `${Date.now()} Hi ${userName}!, You have 2 hours to go to ${doctorSpec} on ${appointmentDate}`;
    const message24h = `${Date.now()} Hi ${userName}!, We remind you that you are scheduled for ${doctorSpec} tomorrow at ${appointmentDate}`;

    if (type === TimeEnum.TWO_HOURS) {
      this.writeToLogFile(message2h);
    }
    if (type === TimeEnum.TWENTY_FOUR_HOURS) {
      this.writeToLogFile(message24h);
    }
  }

  private writeToLogFile(message: string) {
    const writeStream = fs.createWriteStream('notifications.log');
    writeStream.write(message, 'utf-8');
    writeStream.end();
  }
}
