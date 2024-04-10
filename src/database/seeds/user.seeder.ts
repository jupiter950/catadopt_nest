import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { CreateUserDto, UserRole } from '../../users/dto/create-user.dto';
import { User } from '../../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

export default class UserSeeder implements Seeder {
    public async run(
        dataSource: DataSource,
        factoryManager: SeederFactoryManager
    ): Promise<void> {
        const repository = dataSource.getRepository(User);

        await repository.insert([
            {
                firstName: 'admin',
                lastName: 'admin',
                email: 'admin@gmail.com',
                password: await bcrypt.hashSync("123456", 10),
                role: UserRole.Admin
            }
        ]);

        const userFactory = await factoryManager.get(User);
        await userFactory.save();
    }
}