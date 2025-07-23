export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Lojiz";
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  "Ecommerce para aprendizado usando Next!";
export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000/";

export const LATEST_PRODUCTS_LIMIT =
  Number(process.env.LATEST_PRODUCTS_LIMIT) || 4;

export const DAYS_TO_EXPIRE = 30 * 24 * 60 * 60;

export const SIGN_IN_DEFAULT_VALUES = {
  email: "",
  password: "",
};

export const SIGN_UP_DEFAULT_VALUES = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export const shippingAddressDefaultValues = {
  fullName: "",
  streetAddress: "",
  city: "",
  postalCode: "",
  country: "",
};

export const CHECKOUT_STEPS = {
  userLogin: 0,
  shippingAddress: 1,
  paymentMethod: 2,
  placeOrder: 3,
};
