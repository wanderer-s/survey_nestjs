import { createUser } from './user.fixture';
import { UserEntity } from '../../src/user/user.entity';
import { BadRequestException } from '@nestjs/common';

describe('User Entity Test', () => {
  let user: UserEntity;
  beforeEach(async () => {
    user = await createUser();
  });

  describe('Validate Password Test', () => {
    it('password 일치하는 경우 true', async () => {
      const password = '1q2w3e4r';
      const validateResult = await user.validatePassword(password);
      expect(validateResult).toBeTruthy();
    });
    it('password 불일치 하는 경우 false', async () => {
      const password = 'asdfzxcv4';
      const validateResult = await user.validatePassword(password);
      expect(validateResult).toBeFalsy();
    });
  });

  describe('Update User Test', () => {
    it('사용자 정보가 update 된다', () => {
      const updateParam = {
        name: 'updateTest',
        email: 'update@test.com'
      };
      user.update(updateParam);
      expect(user.name).toBe(updateParam.name);
      expect(user.email).toBe(updateParam.email);
    });
  });

  describe('Update User Password Test', () => {
    it('기존에 사용하던 비밀번호를 입력한 경우 예외발생', async () => {
      const password = '1q2w3e4r';
      await expect(
        async () => await user.updatePassword(password)
      ).rejects.toThrowError(BadRequestException);
    });
    it('새 비밀번호를 입력한 경우 비밀번호 변경', async () => {
      const newPassword = 'Hello World';
      await user.updatePassword(newPassword);

      const result = await user.validatePassword(newPassword);
      expect(result).toBeTruthy();
    });
  });
});
