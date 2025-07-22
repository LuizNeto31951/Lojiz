import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

export function formatNumberWithDecimals(num: number): string {
  const [intValue, floatValue] = num.toString().split(".");
  return floatValue
    ? `${intValue}.${floatValue.padEnd(2, "0")}`
    : `${intValue}.00`;
}

export function formatError(error: any) {
  if (error.name === "ZodError") {
    const fieldErrors = Object.keys(error.errors).map(
      (field) => error.errors[field].message
    );
    return fieldErrors.join(". ");
  } else if (
    error.name === "PrismaClentKnownRequestError" &&
    error.code === "P2002"
  ) {
    const field = error.meta?.target ? error.meta.target[0] : "Field";
    return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  } else if (
    error.type === "CredentialsSignin" &&
    error.code === "credentials"
  ) {
    return "Wrong E-mail or Password";
  } else {
    return typeof error.message === "string"
      ? error.message
      : JSON.stringify(error.message);
  }
}

export function round2(value: number | string) {
  if (typeof value === "number") {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  } else if (typeof value === "string") {
    return Math.round(Number(value + Number.EPSILON) * 100) / 100;
  } else {
    throw new Error("Type mismatch of value");
  }
}

const CURRENCY_FORMATER = new Intl.NumberFormat("en-US", {
  currency: "USD",
  style: "currency",
  minimumFractionDigits: 2,
});

export function formatCurrency(amount: number | string | null) {
  if (amount) {
    return CURRENCY_FORMATER.format(Number(amount));
  }
  return "NaN";
}
