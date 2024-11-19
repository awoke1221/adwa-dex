import Joi from 'joi';

export const validatePool = (pool) => {
  const schema = Joi.object({
    tokenA: Joi.string().required(),
    tokenB: Joi.string().required(),
    fee: Joi.number().required(),
    liquidity: Joi.number().required(),
    priceRange: Joi.object({
      min: Joi.number().required(),
      max: Joi.number().required()
    }),
  });

  return schema.validate(pool);
};