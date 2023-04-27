import * as joi from 'joi';

const CREATE_SCHEMA = joi.object({
  user: joi.string().allow(``, null).required(),
  password: joi.string().allow(``, null).required(),
  age: joi.number().allow(``, null).required(),
});

const UPDATE_SCHEMA = joi.object({
  CustId: joi.string().allow(``, null).required(),
});

export { CREATE_SCHEMA, UPDATE_SCHEMA };
