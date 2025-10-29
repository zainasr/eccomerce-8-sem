import { eq, and } from "drizzle-orm";
import { db } from "../database/connection";
import { carts, cartItems } from "../database/schemas/order";
import { products, productImages } from "../database/schemas/product";
import {
  AddToCartRequest,
  UpdateCartItemRequest,
  CartResponse,
} from "../types/order";

export class CartService {
  async getOrCreateCart(userId: string) {
    let [cart] = await db
      .select()
      .from(carts)
      .where(eq(carts.userId, userId))
      .limit(1);

    if (!cart) {
      [cart] = await db
        .insert(carts)
        .values({ userId })
        .returning();
    }

    return cart;
  }

  async addToCart(
    userId: string,
    data: AddToCartRequest
  ): Promise<CartResponse> {
    const cart = await this.getOrCreateCart(userId);

    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, data.productId))
      .limit(1);

    if (!product) {
      throw new Error("Product not found");
    }

    if (product.status !== "active") {
      throw new Error("Product is not available");
    }

    if (product.stockQuantity < data.quantity) {
      throw new Error(
        `Insufficient stock. Only ${product.stockQuantity} items available`
      );
    }

    const [existingItem] = await db
      .select()
      .from(cartItems)
      .where(
        and(
          eq(cartItems.cartId, cart.id),
          eq(cartItems.productId, data.productId)
        )
      )
      .limit(1);

    if (existingItem) {
      const newQuantity = existingItem.quantity + data.quantity;

      if (product.stockQuantity < newQuantity) {
        throw new Error(
          `Insufficient stock. Only ${product.stockQuantity} items available`
        );
      }

      await db
        .update(cartItems)
        .set({
          quantity: newQuantity,
          updatedAt: new Date(),
        })
        .where(eq(cartItems.id, existingItem.id));
    } else {
      await db.insert(cartItems).values({
        cartId: cart.id,
        productId: data.productId,
        quantity: data.quantity,
        price: product.price,
      });
    }

    return this.getCart(userId, true);
  }

  async getCart(
    userId: string,
    includeProductDetails: boolean = false
  ): Promise<CartResponse> {
    const cart = await this.getOrCreateCart(userId);

    const items = await db
      .select()
      .from(cartItems)
      .where(eq(cartItems.cartId, cart.id));

    let enrichedItems = items;
    let totalAmount = 0;

    if (includeProductDetails) {
      enrichedItems = await Promise.all(
        items.map(async (item) => {
          const [product] = await db
            .select()
            .from(products)
            .where(eq(products.id, item.productId))
            .limit(1);

          const images = await db
            .select()
            .from(productImages)
            .where(eq(productImages.productId, item.productId))
            .orderBy(productImages.isPrimary);

          const itemPrice = Number(item.price);
          totalAmount += itemPrice * item.quantity;

          return {
            ...item,
            product: product
              ? {
                  id: product.id,
                  name: product.name,
                  description: product.description || "",
                  price: product.price,
                  images: images.map((img) => ({
                    id: img.id,
                    imageUrl: img.imageUrl,
                    isPrimary: img.isPrimary,
                  })),
                }
              : undefined,
          };
        })
      );
    } else {
      totalAmount = items.reduce(
        (sum, item) => sum + Number(item.price) * item.quantity,
        0
      );
    }

    return {
      cart: {
        ...cart,
        items: enrichedItems,
      },
      totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
      totalAmount,
    };
  }

  async updateCartItem(
    userId: string,
    productId: string,
    data: UpdateCartItemRequest
  ): Promise<CartResponse> {
    const cart = await this.getOrCreateCart(userId);

    const [cartItem] = await db
      .select()
      .from(cartItems)
      .where(
        and(eq(cartItems.cartId, cart.id), eq(cartItems.productId, productId))
      )
      .limit(1);

    if (!cartItem) {
      throw new Error("Item not found in cart");
    }

    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    if (!product) {
      throw new Error("Product not found");
    }

    if (product.stockQuantity < data.quantity) {
      throw new Error(
        `Insufficient stock. Only ${product.stockQuantity} items available`
      );
    }

    await db
      .update(cartItems)
      .set({
        quantity: data.quantity,
        updatedAt: new Date(),
      })
      .where(eq(cartItems.id, cartItem.id));

    return this.getCart(userId, true);
  }

  async removeFromCart(userId: string, productId: string): Promise<CartResponse> {
    const cart = await this.getOrCreateCart(userId);

    const [cartItem] = await db
      .select()
      .from(cartItems)
      .where(
        and(eq(cartItems.cartId, cart.id), eq(cartItems.productId, productId))
      )
      .limit(1);

    if (!cartItem) {
      throw new Error("Item not found in cart");
    }

    await db.delete(cartItems).where(eq(cartItems.id, cartItem.id));

    return this.getCart(userId, true);
  }

  async clearCart(userId: string): Promise<void> {
    const cart = await this.getOrCreateCart(userId);

    await db.delete(cartItems).where(eq(cartItems.cartId, cart.id));
  }

  async getCartItems(userId: string) {
    const cart = await this.getOrCreateCart(userId);

    return await db
      .select()
      .from(cartItems)
      .where(eq(cartItems.cartId, cart.id));
  }
}