import bcrypt from "bcryptjs";

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12');

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

export const verifyPassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};
