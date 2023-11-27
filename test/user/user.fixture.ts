import { createHashedPassword } from '../../src/user/user.utill';
import { UserEntity } from '../../src/user/user.entity';

export async function createUser(
  name: string = 'test',
  email: string = 'test@test.com',
  password: string = '1q2w3e4r'
) {
  const hashedPassword = await createHashedPassword(password);
  return new UserEntity({ name, email, password: hashedPassword });
}
