import { User, UserAttributes } from "../models/user.model";

export const getAllUsers = async () => {
  return await User.findAll();
};

export const getUserById = async (id: number) => {
  return await User.findByPk(id);
};

export const createUser = async (data: Omit<UserAttributes, "id">) => {
  return await User.create(data);
};

export const updateUser = async (id: number, updates: Partial<UserAttributes>) => {
  const user = await User.findByPk(id);
  if (!user) return null;

  if (updates.credit !== undefined) {
    updates.credit = Number(updates.credit);
  }

  return await user.update(updates);
};

export const deleteUser = async (id: number) => {
  const user = await User.findByPk(id);
  if (!user) return null;
  await user.destroy();
  return true;
};

export const getUserByEmail = async (email: string) => {
  return await User.findOne({ where: { email } });
};
