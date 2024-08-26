// rabbitmq.module.ts

import { Module } from '@nestjs/common';
import { typeOrmAsyncConfig } from './typeorm.config';
import { TypeOrmModule } from "@nestjs/typeorm";
import { RabbitMQController } from './rabbitmq.controller';
import { TrackerModule } from './tracker/tracker.module';
import { CronModule } from './cron/cron.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    TrackerModule,
    CronModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [RabbitMQController],
})
export class RabbitMQModules {}
