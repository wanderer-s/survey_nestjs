import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeORMConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'local_user',
  password: 'local_password',
  database: 'survey',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true
};
