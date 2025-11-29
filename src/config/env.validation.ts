import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  PORT: Joi.number().default(3000),
  MONGODB_URI: Joi.string().uri().required(),
  JWT_SECRET: Joi.string().min(16).required(),
  JWT_EXPIRES_IN: Joi.string().default('1h'),
  FRONTEND_APP_URL: Joi.string().uri().default('http://localhost:5173'),
  SYSTEM_ADMIN_NAME: Joi.string().default('System Admin'),
  SYSTEM_ADMIN_EMAIL: Joi.string().email().required(),
  SYSTEM_ADMIN_PASSWORD: Joi.string().min(8).required(),
  INVITE_EXPIRES_IN_HOURS: Joi.number().integer().min(1).default(72),
  EMAIL_HOST: Joi.string().allow('', null),
  EMAIL_PORT: Joi.number().integer().allow(null),
  EMAIL_USER: Joi.string().allow('', null),
  EMAIL_PASSWORD: Joi.string().allow('', null),
  EMAIL_FROM: Joi.string().email().allow('', null),
});
