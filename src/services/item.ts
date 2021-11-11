import { Inject, Service } from 'typedi';

import Generic from '@/services/generic';
import { IItemInputDTO } from '@/interfaces/IItem';

@Service()
export default class Item extends Generic {
  constructor(@Inject('itemModel') private itemModel: Models.ItemModel) {
    super(itemModel);
  }

  public async createItem(createData: IItemInputDTO) {
    return this.create(createData, false, true, 'slug', createData.name);
  }
}
