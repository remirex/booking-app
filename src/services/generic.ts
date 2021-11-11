import mongoose from 'mongoose';

export default class Generic {
  private model;

  constructor() {
    this.model = new mongoose.Model();
  }

  public async create(data: any) {
    const record = await this.model.create({ ...data });
    if (!record) throw 'Cannot create record';
    return record;
  }

  public async getById(id: string) {
    const valid = await Generic.isValid(id);
    if (!valid) throw 'Wrong object id';
    const item = await this.model.findById(id);
    if (!item) throw 'Not found';
    return item;
  }

  public async update() {}

  public async delete() {}

  // helpers
  private static async isValid(id: string) {
    return mongoose.Types.ObjectId.isValid(id);
  }
}
