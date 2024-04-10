import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth.module";
import { AuthService } from "./auth.service";
import { UsersService } from "../users/users.service";
import { CreateUserDto, UserRole } from "../users/dto/create-user.dto";
import { User } from "../users/entities/user.entity";

describe('AuthModule', () => {
  let authService: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres', // or your database type
          host: 'localhost',
          port: 5432,
          username: 'postgres',
          password: 'secret@videl',
          database: 'postgres',
          entities: ['../**/*.entity.ts'], // Add your entity classes here
          synchronize: true, // This will auto-create database schema (use with caution in production)
        }),
        AuthModule],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(usersService).toBeDefined();
  });
  const userDto: CreateUserDto = { 
    email: 'test45@example.com', 
    password: 'password123', 
    firstName: 'test', 
    lastName: 'test', 
    role: UserRole.User
  };
  describe('signUp', () => {
    it('should create a new user', async () => {
      
      jest.spyOn(usersService, 'create').mockImplementation(async () => ({
        id: 1,
        ...userDto,
        favorites: null
      }));

      const newUser = await authService.signUp(userDto.email, userDto.firstName, userDto.lastName, userDto.password);
      expect(newUser).toBeDefined();
      expect(newUser.email).toEqual(userDto.email);      
    })
  })

  describe('SignIn', () => {
    it('should return access token upon successful login', async () => {
      const credentials = { email: 'admin@gmail.com', password: "123456" }
      const accessToken = await authService.signIn(credentials.email, credentials.password);

      expect(accessToken).toBeDefined();
      expect(typeof accessToken).toBe('object');
    });

    it('should throw an error for invalid credectials', async () => {
      const credentials = { email: 'test@example.com', password: 'invalidpassword' };

      // Mock the method call to findByEmail in UsersService
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);

      // Expect signIn to throw an error for invalid credentials
      await expect(authService.signIn(credentials.email, credentials.password)).rejects.toThrow('Unauthorized');
    })
  })
})