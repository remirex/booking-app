import mongoose from 'mongoose';
import slugify from 'slugify';

import AlreadyExistException from "@/api/exceptions/AlreadyExistException";
import CannotCreateRecordException from "@/api/exceptions/CannotCreateRecordException";
import WrongObjectIdException from "@/api/exceptions/WrongObjectIdException";
import NotFoundException from "@/api/exceptions/NotFoundException";

export default class Generic {
  private readonly model;

  constructor(model: mongoose.Model<any>) {
    this.model = model;
  }

  public async create(data: any, isUpdate: boolean, isUnique: boolean, search_field: string, search_value: any) {
    const exist = await isExist(this.model, isUpdate, isUnique, search_field, search_value);
    if (exist) throw new AlreadyExistException(search_value);

    const record = await this.model.create({ ...data });
    if (!record) throw new CannotCreateRecordException();

    return record;
  }

  public async getById(id: string) {
    const valid = isValid(id);
    if (!valid) throw new WrongObjectIdException();

    const item = await this.model.findById(id);
    if (!item) throw new NotFoundException();

    return item;
  }

  public async update() {}

  public async delete() {}
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
  const queryObj = {};
  if (search_field !== '' && search_value !== '') {
    queryObj[search_field] = isUnique ? slugify(search_value, { lower: true }) : search_value;
  }
  const find = await model.findOne(queryObj);
  return find && !isUpdate;
}