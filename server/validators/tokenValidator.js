import Joi from 'joi';

export const validateToken = (token) => {
  const schema = Joi.object({
    symbol: Joi.string().required(),
    name: Joi.string().required(),
    address: Joi.string().required(),
    decimals: Joi.number().required(),
    logoURI: Joi.string().uri().required(),
  });

  return schema.validate(token);
};