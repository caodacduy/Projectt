import Cookies from 'js-cookie';

// Hàm set cookie
export const setCookie = (name, value, days) => {
  Cookies.set(name, value, { expires: days });
};

// Hàm lấy cookie
export const getCookie = (name) => {
  return Cookies.get(name);
};

// Hàm xóa cookie
export const eraseCookie = (name) => {
  Cookies.remove(name);
};