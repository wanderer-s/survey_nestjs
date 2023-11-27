import * as bcrypt from 'bcrypt';

export async function createHashedPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function validateHashedPassword(
  hashedPassword: string,
  password: string
) {
  return bcrypt.compare(hashedPassword, password);
}