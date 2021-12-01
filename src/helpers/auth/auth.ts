import * as crypto from 'crypto';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

export function randomTokenString() {
  return crypto.randomBytes(40).toString('hex');
}

export async function generateRefreshToken(data: any, ipAddress: string, model: mongoose.Model<any>) {
  // create a refresh token that expires in 7 days
  return await model.create({
    user: data._id,
    token: randomTokenString(),
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdByIp: ipAddress,
  });
}

export async function tokenOwner(
  data: any,
  authHeader: string | undefined,
  userModel: mongoose.Model<any>,
  tokenModel: mongoose.Model<any>,
) {
  let decoded: any;
  if (authHeader != null) {
    decoded = jwt.decode(authHeader);
  }
  const user = await userModel.findById(decoded.id);
  const refreshTokens = await tokenModel.find({ user: user._id });

  const found = refreshTokens.some(item => {
    return item.token === data.token;
  });

  return !!found;
}
