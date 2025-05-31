import ApiResponse from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Item } from "../models/item.model.js";
import { Cart } from "../models/cart.model.js";

// Get all items in the current user's cart
export const getCartItems = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const cart = await Cart.findOne({ user: userId }).populate("items.item");
  if (!cart) {
    return res
      .status(200)
      .json(
        new ApiResponse(200, { items: [], totalPrice: 0 }, "Cart is empty")
      );
  } // Calculate total price
  const totalPrice = cart.items.reduce((total, cartItem) => {
    const item = cartItem.item;
    if (item && cartItem.purchase) {
      const itemPrice = item.price * cartItem.quantity;
      return total + itemPrice;
    } else {
      const rentalPrice =
        item.rentalPrice * cartItem.quantity * cartItem.rentalPeriod;
      return total + rentalPrice;
    }
  }, 0);
  res
    .status(200)
    .json(
      new ApiResponse(200, { cart, totalPrice }, "Cart fetched successfully")
    );
});

// Add an item to the cart
export const addToCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { item, quantity, rentalPeriod, purchase } = req.body;
  if (!item || !quantity) {
    throw new ApiError(400, "Missing required fields");
  }
  const foundItem = await Item.findById(item);
  if (!foundItem) {
    throw new ApiError(404, "Item not found");
  }
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  // Check if item already exists in cart
  const existing = cart.items.find(
    (i) => i.item.toString() === item && i.purchase === !!purchase
  );
  if (existing) {
    existing.quantity += quantity;
    existing.rentalPeriod = rentalPeriod;
    existing.purchase = !!purchase;
  } else {
    cart.items.push({ item, quantity, rentalPeriod, purchase: !!purchase });
  }
  await cart.save();

  // Populate the cart and calculate total price for response
  await cart.populate("items.item");
  const totalPrice = cart.items.reduce((total, cartItem) => {
    const item = cartItem.item;
    if (item && cartItem.purchase) {
      const itemPrice = item.price * cartItem.quantity;
      return total + itemPrice;
    } else {
      const rentalPrice =
        item.rentalPrice * cartItem.quantity * cartItem.rentalPeriod;
      return total + rentalPrice;
    }
  }, 0);

  res
    .status(200)
    .json(new ApiResponse(200, { cart, totalPrice }, "Item added to cart"));
});

// Update an item in the cart (quantity, rentalPeriod, purchase)
export const updateCartItem = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { itemId, quantity, rentalPeriod, purchase } = req.body;
  if (!itemId) {
    throw new ApiError(400, "Item id is required");
  }
  let cart = await Cart.findOne({ user: userId });
  if (!cart) throw new ApiError(404, "Cart not found");
  
  const cartItem = cart.items.find(
    (i) => i.item.toString() === itemId && i.purchase === !!purchase
  );

  if (!cartItem) throw new ApiError(404, "Item not found in cart");
  if (quantity !== undefined) cartItem.quantity = quantity;
  if (rentalPeriod !== undefined) cartItem.rentalPeriod = rentalPeriod;
  if (purchase !== undefined) cartItem.purchase = !!purchase;
  await cart.save();

  // Populate the cart and calculate total price for response
  await cart.populate("items.item");
  const totalPrice = cart.items.reduce((total, cartItem) => {
    const item = cartItem.item;
    if (item && cartItem.purchase) {
      const itemPrice = item.price * cartItem.quantity;
      return total + itemPrice;
    } else {
      const rentalPrice =
        item.rentalPrice * cartItem.quantity * cartItem.rentalPeriod;
      return total + rentalPrice;
    }
  }, 0);

  res
    .status(200)
    .json(new ApiResponse(200, { cart, totalPrice }, "Cart item updated"));
});

// Remove an item from the cart
export const removeCartItem = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { item, purchase } = req.body;
  if (!item) throw new ApiError(400, "Item id is required");
  let cart = await Cart.findOne({ user: userId });
  if (!cart) throw new ApiError(404, "Cart not found");
  cart.items = cart.items.filter(
    (i) => !(i.item.toString() === item && i.purchase === !!purchase)
  );
  await cart.save();

  // Populate the cart and calculate total price for response
  await cart.populate("items.item");
  const totalPrice = cart.items.reduce((total, cartItem) => {
    const item = cartItem.item;
    if (item && cartItem.purchase) {
      const itemPrice = item.price * cartItem.quantity;
      return total + itemPrice;
    } else {
      const rentalPrice =
        item.rentalPrice * cartItem.quantity * cartItem.rentalPeriod;
      return total + rentalPrice;
    }
  }, 0);

  res
    .status(200)
    .json(new ApiResponse(200, { cart, totalPrice }, "Item removed from cart"));
});

// Clear all items from the cart
export const clearCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  let cart = await Cart.findOne({ user: userId });
  if (!cart) throw new ApiError(404, "Cart not found");
  cart.items = [];
  await cart.save();
  res
    .status(200)
    .json(new ApiResponse(200, { cart, totalPrice: 0 }, "Cart cleared"));
});
