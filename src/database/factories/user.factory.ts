import { setSeederFactory } from "typeorm-extension";
import * as bcrypt from 'bcrypt';

import { CreateUserDto, UserRole } from "../../users/dto/create-user.dto";
import { User } from "../../users/entities/user.entity";


export default setSeederFactory(User, async (faker): Promise<CreateUserDto> => {
    const user: CreateUserDto = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        role: UserRole.User,
        password: await bcrypt.hashSync("123456", 10)
    }

    return user;
});