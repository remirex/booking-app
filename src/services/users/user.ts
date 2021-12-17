import { Inject, Service } from 'typedi';
import { Body, Post, Response, Route, SuccessResponse, Tags, Query, Hidden } from 'tsoa';

import Generic from '../generic';

@Route('/user')
@Tags('User')
@Service()
export default class UserService extends Generic {
  constructor(@Inject('userModel') private userModel: Models.UserModel) {
    super(userModel);
  }
}
