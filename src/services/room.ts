import { Inject, Service } from 'typedi';
import { Tags, Route, Post, Body, SuccessResponse } from 'tsoa';

import Generic from './generic';
import { IRoomInputDTO } from '../interfaces/IRoom';

@Tags('Rooms')
@Route('/room')
@Service()
export default class Room extends Generic {
  constructor(@Inject('roomModel') private roomModel: Models.RoomModel) {
    super(roomModel);
  }

  @Post('/add')
  @SuccessResponse('201', 'Created')
  public async addNewRoom(@Body() addData: IRoomInputDTO) {
    return await this.create(addData, false, false);
  }
}
