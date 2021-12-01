import { Inject, Service } from 'typedi';
import { Tags, Route, Post, Body, SuccessResponse, Response } from 'tsoa';

import Generic from '../../generic';
import { IRoomInputDTO } from '../../../interfaces/IRoom';
import { ValidationErrorResponse } from '../../../types/validationErrorResponse';

@Tags('Rooms')
@Route('/room')
@Service()
export default class Room extends Generic {
  constructor(@Inject('roomModel') private roomModel: Models.RoomModel) {
    super(roomModel);
  }

  @Post('/add')
  @SuccessResponse('201', 'Created')
  @Response<ValidationErrorResponse>(422, 'Validation Failed', {
    name: 'Validation Error.',
    message: 'Some fields are not valid.',
    status: false,
    errors: [
      {
        message: 'name is not allowed to be empty',
        field: {
          label: 'name',
          value: '',
          key: 'name',
        },
      },
    ],
  })
  public async addNewRoom(@Body() addData: IRoomInputDTO) {
    return await this.create(addData, false, false);
  }
}
