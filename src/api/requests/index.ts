import { createItemSchema } from './item/create';
import { addRoomSchema } from './room/add';
import { registerSchema } from './auth/register';
import { verifySchema } from './auth/verify';

export default {
  createItemSchema,
  addRoomSchema,
  registerSchema,
  verifySchema,
};
