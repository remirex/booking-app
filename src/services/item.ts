import { Inject, Service } from 'typedi';

import Generic from '../services/generic';
import { IItemInputDTO } from '../interfaces/IItem';

@Service()
export default class Item extends Generic {
  constructor(@Inject('itemModel') private itemModel: Models.ItemModel) {
    super(itemModel);
  }

  public async createItem(createData: IItemInputDTO) {
    return this.create(createData, false, true, ['slug'], [createData.name]);
  }

  public async getItem(itemId: string) {
    return this.getById(itemId);
  }

  public async updateItem(itemId: string, updateData: IItemInputDTO) {
    return this.update(itemId, updateData, true, true, 'slug', updateData.name);
  }

  public async deleteItem(itemId: string) {
    return this.delete(itemId);
  }
}
