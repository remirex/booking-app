import mongoose from 'mongoose';
import slugify from 'slugify';

import AlreadyExistException from '../api/exceptions/alreadyExistException';
import CannotCreateRecordException from '../api/exceptions/cannotCreateRecordException';
import WrongObjectIdException from '../api/exceptions/wrongObjectIdException';
import NotFoundException from '../api/exceptions/notFoundException';

export default class Generic {
  private readonly model;

  constructor(model: mongoose.Model<any>) {
    this.model = model;
  }

  public async create(
    data: any,
    isUpdate: boolean,
    isUnique: boolean,
    searchUniqueFields?: string[],
    searchUniqueValues?: string[],
  ) {
    if (isUnique && searchUniqueFields && searchUniqueValues) {
      for (const [i, sf] of searchUniqueFields.entries()) {
        const sv = searchUniqueValues[i];
        const exist = await isExist(this.model, isUpdate, isUnique, sf, sv);
        if (exist) throw new AlreadyExistException(sv);
      }
    }

    const record = await this.model.create({ ...data });
    if (!record) throw new CannotCreateRecordException();

    return record;
  }

  public async getById(id: string) {
    const valid = await isValid(id);
    if (!valid) throw new WrongObjectIdException();

    const item = await this.model.findById(id);
    if (!item) throw new NotFoundException();

    return item;
  }

  public async findBy(search_field: string, search_value: any, refs?: string[]) {
    const queryObj: any = {};
    queryObj[search_field] = search_value;
    if (refs?.length != 0) {
      const item = await this.model.findOne(queryObj).populate(refs);
      if (!item) throw new NotFoundException();
      return item;
    }
    const item = await this.model.findOne(queryObj);
    if (!item) throw new NotFoundException();
    return item;
  }

  public async findByQueryObject(queryObj) {
    const item = await this.model.findOne(queryObj);
    if (!item) throw new NotFoundException();
    return item;
  }

  public async update(
    id: string,
    data: any,
    isUpdate: boolean,
    isUnique: boolean,
    searchUniqueFields?: string[],
    searchUniqueValues?: string[],
  ) {
    const valid = await isValid(id);
    if (!valid) throw new WrongObjectIdException();

    if (isUnique && searchUniqueFields && searchUniqueValues) {
      for (const [i, sf] of searchUniqueFields.entries()) {
        const sv = searchUniqueValues[i];
        const exist = await isExist(this.model, isUpdate, isUnique, sf, sv);
        if (exist) throw new AlreadyExistException(sv);
        data[sf] = slugify(sv, { lower: true });
      }
    }

    const item = await this.model.findByIdAndUpdate(id, { ...data }, { new: true });
    if (!item) throw new NotFoundException();

    return item;
  }

  public async updateOne(queryObject: any, toUpdate: any) {
    await this.model.updateOne(queryObject, {
      $set: toUpdate,
    });
  }

  public async delete(id: string) {
    const valid = await isValid(id);
    if (!valid) throw new WrongObjectIdException();

    const item = await this.model.findByIdAndRemove(id);
    if (!item) throw new NotFoundException();

    return true;
  }

  public async countDocuments() {
    return await this.model.countDocuments();
  }
}

async function isValid(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}

async function isExist(
  model: mongoose.Model<any>,
  isUpdate: boolean,
  isUnique: boolean,
  search_field: string,
  search_value: any,
) {
  const queryObj: any = {};
  if (search_field !== '' && search_value !== '') {
    queryObj[search_field] = isUnique ? slugify(search_value, { lower: true }) : search_value;
  }
  const find = await model.findOne(queryObj);
  return find && !isUpdate;
}
