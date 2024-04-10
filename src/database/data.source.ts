import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

export const dbdatasource: DataSourceOptions & SeederOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'secret@videl',
    database: 'postgres',
    synchronize: true,
    entities: ['src/**/*.entity{.ts,.js}'],
    migrations: ['src/migration/*.ts'],
    seeds: ['src/database/seeds/**/*{.ts,.js}'],
    factories: ['src/database/**/*{.ts,.js}'],
    migrationsTableName: "migration",

};

const dataSource = new DataSource(dbdatasource)
export default dataSource