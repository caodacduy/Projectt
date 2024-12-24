import axios from "axios";

const API_BASE_URL = "https://backend-order-8.onrender.com/admin/api/food";

export const getFoods = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data; // Giả định API trả về danh sách thực phẩm trong `data`
  } catch (error) {
    console.error("Error fetching food data:", error);
    return [];
  }
};
