import { UserService } from '../../src/user/user.service';
import { Repository } from 'typeorm';
import { UserEntity } from '../../src/user/user.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { createUser } from './user.fixture';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { validateHashedPassword } from '../../src/user/user.utill';

describe('User Service Test', () => {
  let userService: UserService;
  let userRepository: Repository<UserEntity>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useClass: Repository
        },
        JwtService
      ]
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity)
    );
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('findById', () => {
    const user = createUser();
    it('주어진 id로 user를 찾는 경우 user entity 반환', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(user);

      const result = await userService.findById(1);
      expect(result).toBe(await user);
    });
    it('주어진 id로 user를 찾을 수 없는 경우 예외 처리', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);

      await expect(async () => await userService.findById(2)).rejects.toThrow(
        NotFoundException
      );
    });

    describe('findByEmail', () => {
      const user = createUser();
      it('주어진 email로 user를 찾는 경우 user entity 반환', async () => {
        jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(user);

        const result = await userService.findByEmail('test@test.com');
        expect(result).toBe(await user);
      });
      it('주어진 email로 user를 찾을 수 없는 경우 예외 처리 ', async () => {
        jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);

        await expect(
          async () => await userService.findByEmail('nothing')
        ).rejects.toThrow(NotFoundException);
      });
    });
  });

  describe('signIn', () => {
    const user = createUser();
    const rightPassword = '1q2w3e4r';
    const wrongPassword = 'HelloWorld';
    it('sign in 성공시 token 발급', async () => {
      const mockToken = 'this is mock token';
      jest.spyOn(userService, 'findByEmail').mockResolvedValue(user);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue(mockToken);

      const result = await userService.signIn('test@test.com', rightPassword);
      expect(result).toBe(mockToken);
    });
    it('비밀번호가 일치 하지 않아 sign in 실패 시 예외 발생', () => {
      jest.spyOn(userService, 'findByEmail').mockResolvedValue(user);
      expect(
        async () => await userService.signIn('test@test.com', wrongPassword)
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('update', () => {
    it('사용자 정보 update', async () => {
      const user = await createUser();
      user.id = 1;
      jest.spyOn(userService, 'findById').mockResolvedValue(user);
      jest.spyOn(userRepository, 'save').mockResolvedValue(user);
      const updateParam = {
        id: 1,
        name: 'update test name',
        password: '1q2w3e4r',
        userId: 1
      };
      const result = await userService.update(updateParam);
      expect(result.name).toBe(updateParam.name);
    });
    it('사용자 변경을 시도하는 사람이 당사자가 아닌 경우 예외 발생', async () => {
      const user = await createUser();
      user.id = 1;

      jest.spyOn(userService, 'findById').mockResolvedValue(user);
      jest.spyOn(userRepository, 'save').mockResolvedValue(user);
      const updateParam = {
        id: 1,
        name: 'update test name',
        password: '1q2w3e4r',
        userId: 10
      };
      await expect(
        async () => await userService.update(updateParam)
      ).rejects.toThrow(ForbiddenException);
    });
    it('비밀번호가 일치하지 않을 시 예외 발생', async () => {
      const user = await createUser();
      user.id = 1;
      jest.spyOn(userService, 'findById').mockResolvedValue(user);
      const updateParam = {
        id: 1,
        name: 'update test name',
        password: 'wrong password',
        userId: 1
      };
      await expect(
        async () => await userService.update(updateParam)
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('updatePassword', () => {
    it('사용자 password update', async () => {
      const user = await createUser();
      user.id = 1;
      jest.spyOn(userService, 'findById').mockResolvedValue(user);
      jest.spyOn(userRepository, 'save').mockResolvedValue(user);

      const updatePasswordParam = {
        id: 1,
        password: '1q2w3e4r',
        newPassword: 'newPassword',
        userId: 1
      };
      await userService.updatePassword(updatePasswordParam);
      const { password } = user;
      expect(
        validateHashedPassword(password, updatePasswordParam.newPassword)
      ).toBeTruthy();
    });
    it('비밀번호가 일치하지 않을 시 예외 발생', async () => {
      const user = await createUser();
      user.id = 1;
      jest.spyOn(userService, 'findById').mockResolvedValue(user);
      jest.spyOn(userRepository, 'save').mockResolvedValue(user);

      const updatePasswordParam = {
        id: 1,
        password: 'wrongPassword',
        newPassword: 'newPassword',
        userId: 1
      };

      await expect(
        async () => await userService.updatePassword(updatePasswordParam)
      ).rejects.toThrow(BadRequestException);
    });
    it('비밀번호 변경을 시도하는 사람이 당사자가 아닌 경우 예외 발생', async () => {
      const user = await createUser();
      user.id = 1;

      jest.spyOn(userService, 'findById').mockResolvedValue(user);
      jest.spyOn(userRepository, 'save').mockResolvedValue(user);
      const updatePasswordParam = {
        id: 1,
        password: '1q2w3e4r',
        newPassword: 'newPassword',
        userId: 10
      };
      await expect(
        async () => await userService.updatePassword(updatePasswordParam)
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('signUp', () => {
    const user = createUser();
    it('사용자 회원가입 이후 생성된 userId 반환 ', async () => {
      jest.spyOn(userRepository, 'save').mockResolvedValue(user);
      const createParam = {
        name: 'test',
        email: 'test@test.com',
        password: '1q2w3e4r'
      };
      const result = await userService.signUp(createParam);
      const { id } = await user;

      expect(result).toBe(id);
    });
  });
});
