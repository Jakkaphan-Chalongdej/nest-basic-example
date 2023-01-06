import { ApiModule } from '@Api/api.module';
import { DatabaseModule } from '@Database/database.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@Config/config.module';
import { DataSource } from 'typeorm';

@Module({
  imports: [DatabaseModule, ConfigModule, ApiModule],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
