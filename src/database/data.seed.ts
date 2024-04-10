import { DataSource, DataSourceOptions } from "typeorm";
import { runSeeders, SeederOptions } from "typeorm-extension";

(async () => {
    const options: DataSourceOptions = {
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'secret@videl',
        database: 'postgres',
    };

    const dataSource = new DataSource(options);
    await dataSource.initialize();

    runSeeders(dataSource, {
        seeds: ['src/database/seeds/*{.ts,.js}'],
        factories: ['src/database/factories/**/*{.ts,.js}']
    });
})();