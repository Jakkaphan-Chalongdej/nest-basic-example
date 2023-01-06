import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { join } from 'path';

export default () =>
  ({
    type: process.env.DB_DIALECT || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_DATABASE || 'test',
    logging: false,
    entities: [
      join(__dirname, '..', 'database', 'entities', '*.entity{.ts,.js}'),
    ],
    migrations: [join(__dirname, '..', 'database', 'migrations', '*{.ts,.js}')],
    cli: {
      migrationsDir: join(__dirname, '..', 'database', 'migrations'),
    },
    migrationsTableName: 'migrations',
    autoLoadEntities: true,
    synchronize: true,
    namingStrategy: new SnakeNamingStrategy(),
  } as TypeOrmModuleOptions);
