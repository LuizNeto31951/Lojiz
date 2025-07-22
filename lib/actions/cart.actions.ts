"use server";

import { CartItem } from "@/types";
import { convertToPlainObject, formatError, round2 } from "../utils";
import { cookies } from "next/headers";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { cartItemSchema, insertCartSchema } from "../validators";
import { revalidatePath } from "next/cache";

const calcPrice = (items: CartItem[]) => {
  const itemsPrice = round2(
      items.reduce((acc, item) => acc + Number(item.price) * item.qtd, 0)
    ),
    shippingPrice = round2(itemsPrice > 100 ? 0 : 10),
    taxPrice = round2(0.15 * itemsPrice),
    totalPrice = round2(itemsPrice + taxPrice + shippingPrice);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
};

async function getCartData() {
  const sessionCartId = (await cookies()).get("sessionCartId")?.value;
  if (!sessionCartId) throw new Error("Cart session not found");

  const session = await auth();
  const userId = session?.user?.id ? (session.user.id as string) : undefined;
  return {
    sessionCartId,
    session,
    userId,
  };
}

export async function addItemToCart(data: CartItem) {
  try {
    const { sessionCartId, userId } = await getCartData();
    const cart = await getMyCart();
    const item = cartItemSchema.parse(data);
    const product = await prisma.product.findFirst({
      where: { id: item.productId },
    });

    if (!product) throw new Error("Product not found!");

    if (!cart) {
      const newCart = insertCartSchema.parse({
        userId: userId,
        items: [item],
        sessionCartId: sessionCartId,
        ...calcPrice([item]),
      });

      await prisma.cart.create({
        data: newCart,
      });

      revalidatePath(`/product/${product.slug}`);
    } else {
      const existItem = (cart.items as CartItem[]).find(
        (value) => value.productId === item.productId
      );
      if (product?.stock < 1) throw new Error("Product out of stock!");
      if (existItem?.productId) {
        if (product.stock < existItem.qtd + 1) {
          throw new Error("Not enough products in stock!");
        }
        existItem.qtd++;
      } else {
        cart.items.push(item);
      }
      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: cart.items,
          ...calcPrice(cart.items as CartItem[]),
        },
      });
      revalidatePath(`/product/${product.slug}`);
    }
    return {
      success: true,
      message: `"${product.name} added to cart!`,
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function getMyCart() {
  const { sessionCartId, userId } = await getCartData();

  const cart = await prisma.cart.findFirst({
    where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
  });

  if (!cart) return undefined;

  return convertToPlainObject({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.itemsPrice.toString(),
    shippingPrice: cart.itemsPrice.toString(),
    taxPrice: cart.itemsPrice.toString(),
  });
}

export async function removeItemFromCart(productId: string) {
  try {
    const product = await prisma.product.findFirst({
      where: { id: productId },
    });
    if (!product) throw new Error("Product not found!");

    const cart = await getMyCart();
    if (!cart) throw new Error("Cart not found");

    const exist = (cart.items as CartItem[]).find(
      (value) => value.productId === productId
    );
    if (!exist) throw new Error("Product not found!");

    if (exist.qtd === 1) {
      cart.items = cart.items.filter(
        (value) => value.productId !== exist.productId
      );
    } else {
      cart.items.find((value) => value.productId === productId)!.qtd =
        exist.qtd - 1;
    }

    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: cart.items,
        ...calcPrice(cart.items as CartItem[]),
      },
    });
    revalidatePath(`/product/${product.slug}`);

    return { success: true, message: `${product.name} was removed from cart` };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
