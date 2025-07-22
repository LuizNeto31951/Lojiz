"use client";

import { Button } from "@/components/ui/button";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { Cart, CartItem } from "@/types";
import { Loader, Minus, PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

const AddToCart = ({ item, cart }: { item: CartItem; cart?: Cart }) => {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const handleAddToCart = async () => {
    startTransition(async () => {
      const response = await addItemToCart(item);
      if (!response.success) {
        toast.error(response.message);
        return;
      }
      toast.success(response.message, {
        action: {
          label: "Go to cart",
          onClick: () => router.push("/cart"),
        },
      });
    });
  };

  const handleRemoveFromCart = async () => {
    startTransition(async () => {
      const response = await removeItemFromCart(item.productId);

      if (!response.success) {
        toast.error(response.message);
      }
      toast.success(response.message);
      return;
    });
  };

  const existItem =
    cart && cart.items.find((value) => value.productId === item.productId);

  return existItem ? (
    <div>
      <Button type="button" variant={"outline"} onClick={handleRemoveFromCart}>
        {isPending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Minus className="h-4 w-4" />
        )}
      </Button>
      <span className="px-4">{existItem.qtd}</span>
      <Button type="button" variant={"outline"} onClick={handleAddToCart}>
        {isPending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <PlusIcon className="h-4 w-4" />
        )}
      </Button>
    </div>
  ) : (
    <Button className="w-full" type="button" onClick={handleAddToCart}>
      {isPending ? (
        <Loader className="w-4 h-4 animate-spin" />
      ) : (
        <PlusIcon className="h-4 w-4" />
      )}
      Add to cart!
    </Button>
  );
};

export default AddToCart;
