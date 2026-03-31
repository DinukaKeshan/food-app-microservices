import dotenv from "dotenv";

dotenv.config();

export const SERVICES = {
  USER_SERVICE: process.env.USER_SERVICE,
  ORDER_SERVICE: process.env.ORDER_SERVICE,
  PAYMENT_SERVICE: process.env.PAYMENT_SERVICE,
  RESTAURANT_SERVICE: process.env.RESTAURANT_SERVICE,
  REVIEW_SERVICE: process.env.REVIEW_SERVICE,
  DELIVERY_SERVICE: process.env.DELIVERY_SERVICE,
};
