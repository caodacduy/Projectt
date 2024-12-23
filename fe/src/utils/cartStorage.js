import Cookies from 'js-cookie';

const CART_COOKIE_NAME = 'shopping_cart';

export const getCartFromCookie = () => {
  const cartData = Cookies.get(CART_COOKIE_NAME);
  return cartData ? JSON.parse(cartData) : [];
};

export const saveCartToCookie = (cart) => {
  Cookies.set(CART_COOKIE_NAME, JSON.stringify(cart), { expires: 7 }); // Lưu trong 7 ngày
};

export const clearCartFromCookie = () => {
  Cookies.remove(CART_COOKIE_NAME);
};
