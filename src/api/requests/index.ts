import { createItemSchema } from './item/create';
import { addRoomSchema } from './room/add';
import { registerSchema } from './auth/register';
import { tokenSchema } from './auth/token';
import { loginSchema } from './auth/login';

export default {
  createItemSchema,
  addRoomSchema,
  registerSchema,
  tokenSchema,
  loginSchema,
};
