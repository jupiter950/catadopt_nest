import { Test, TestingModule } from '@nestjs/testing';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { Favorite } from './entities/favorite.entity';
import { User } from '../users/entities/user.entity';
import { Cat } from '../cats/entities/cat.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult } from 'typeorm';

describe('FavoriteController', () => {
  let controller: FavoritesController;
  let service: FavoritesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FavoritesController],
      providers: [
        FavoritesService,
        {
          provide: getRepositoryToken(Favorite),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            findOneBy: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          }
        },
        {
          provide: getRepositoryToken(Cat),
          useValue: {

          }
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
           
          }
        },
        
      ]
    }).compile();

    controller = module.get<FavoritesController>(FavoritesController);
    service = module.get<FavoritesService>(FavoritesService);
  });

  it('should create a favorite', async () => {
    const createFavoriteDto: CreateFavoriteDto = {
      user_id: 1,
      cat_id: 2
    };

    jest.spyOn(service, 'create').mockImplementation(async (createFavoriteDto: CreateFavoriteDto) => {
      // Here you can mock any necessary behavior related to the creation of a favorite
      // For example, you can return a mock favorite object
      return {
        id: 1,
        user: { id: createFavoriteDto.user_id } as Partial<User>,
        cat: { id: createFavoriteDto.cat_id } as Partial<Cat>
      } as Favorite;
    });

    const result = await controller.create(createFavoriteDto);

    expect(service.create).toHaveBeenCalled();
    expect(result).toEqual({
      id: 1,
      user: { id: createFavoriteDto.user_id } as Partial<User>,
      cat: { id: createFavoriteDto.cat_id } as Partial<Cat>
    } as Favorite);
  });

  it('should remove a favorite', async () => {
    const userId = '1';
    const catId = '1';

    jest.spyOn(service, 'remove').mockResolvedValue({} as DeleteResult);

    const result = await controller.remove(userId, catId);

    expect(service.remove).toHaveBeenCalled();

    expect(result).toEqual({} as DeleteResult);
  })
})