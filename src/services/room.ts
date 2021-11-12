import { Inject, Service } from 'typedi';

import Generic from '@/services/generic';
import { IRoomInputDTO } from '@/interfaces/IRoom';

@Service()
export default class Room extends Generic {
  constructor(@Inject('roomModel') private roomModel: Models.RoomModel) {
    super(roomModel);
  }

  public async addNewRoom(addData: IRoomInputDTO) {
    return this.create(addData, false, false);
  }
}
