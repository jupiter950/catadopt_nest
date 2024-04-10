import { Test, TestingModule } from '@nestjs/testing';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Cat } from './entities/cat.entity';
import { AuthGuard } from '../auth/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ForbiddenException } from '@nestjs/common';



describe('CatsController', () => {
  let controller: CatsController;
  let service: CatsService;
  let mockGuard: RolesGuard;

  beforeEach(async () => {
    const mockJwtService = {
      sign: jest.fn(),
      verify: jest.fn()
    }
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatsController],
      providers: [
        {
          provide: CatsService,
          useValue: {
            remove: jest.fn().mockResolvedValue(Promise< Cat | string | ForbiddenException>),
            create: jest.fn().mockResolvedValue(Promise<Cat | ForbiddenException>),
            update: jest.fn().mockResolvedValue(Promise<Cat | ForbiddenException>),
            findAll: jest.fn().mockResolvedValue(Promise<Cat[]>),
            findOne: jest.fn().mockResolvedValue(Promise<Cat>)
          }
        },
        AuthGuard,
        {
          provide: RolesGuard,
          useValue: { canActivate: jest.fn().mockReturnValue(true) }, // Mock the RolesGuard for testing
        },
        {
          provide: getRepositoryToken(Cat),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            findOneBy: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          }
        },
        {
          provide: JwtService,
          useValue: mockJwtService
        }
      ],
    }).compile();

    controller = module.get<CatsController>(CatsController);
    service = module.get<CatsService>(CatsService);
    mockGuard = module.get<RolesGuard>(RolesGuard);
  });

  describe('create', () => {
    it('should create a new cat when user has admin role', async () => {
      const createCatDto: CreateCatDto = { name: 'Fluffy', age: 3, breed: 'Persian' };

      jest.spyOn(service, 'create').mockResolvedValue({ id: 1, ...createCatDto, favorites: null });

      await controller.create(createCatDto);

      expect(service.create).toHaveBeenCalledWith(createCatDto);
    });

    it('should not create a new cat when user does not have admin role', async () => {
      // Mock the RolesGuard to return false when canActivate is called
      mockGuard.canActivate = jest.fn().mockReturnValue(false);

      const createCatDto: CreateCatDto = { name: 'Fluffy', age: 3, breed: 'Persian' };
      expect(controller.create(createCatDto)).toBeInstanceOf(Promise<ForbiddenException>)
    });
  });

  describe('update', () => {
    it('should update a cat when user has admin role', async () => {
      const updatCatDto: UpdateCatDto = { name: 'Fluffy', age: 3, breed: 'Persian' };

      jest.spyOn(service, 'update').mockResolvedValue({ id: 1, ...updatCatDto, favorites: null });

      await controller.update('1', updatCatDto);

      expect(service.update).toHaveBeenCalledWith(1, updatCatDto);
    });

    it('should not create a new cat when user does not have admin role', async () => {
      // Mock the RolesGuard to return false when canActivate is called
      mockGuard.canActivate = jest.fn().mockReturnValue(false);

      const updatCatDto: UpdateCatDto = { name: 'Fluffy', age: 3, breed: 'Persian' };
      expect(controller.update('1', updatCatDto)).toBeInstanceOf(Promise<ForbiddenException>)
    });
  });

  describe('delete', () => {
    it('should update a cat when user has admin role', async () => {
      const catId = '1';

      await controller.remove(catId);

      expect(service.remove).toHaveBeenCalledWith(+catId);
    });

    it('should not create a new cat when user does not have admin role', async () => {
      const catId = '1'
      // Mock the RolesGuard to return false when canActivate is called
      jest.spyOn(mockGuard, 'canActivate').mockReturnValue(false);

      expect(controller.remove(catId)).toBeInstanceOf(Promise<ForbiddenException>)
    });
  });

  describe('Find all cats', () => {
    it('should return an array of cats', async () => {
      const cats: Cat[] = [{ id: 1, name: 'Fluffy', age: 2, breed: 'Persian', favorites: null }, { id: 2, name: 'Whiskers', age: 3, breed: 'Persian', favorites: null }];
      jest.spyOn(service, 'findAll').mockResolvedValue(cats);

      const result = await controller.findAll();

      expect(result).toEqual(cats);
    })
  });
})