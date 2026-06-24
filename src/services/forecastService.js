import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api/forecasts";

export const getDemandForecastApi = async (
  category = "All Categories",
  product = "All Products"
) => {

  const response =
    await axios.get(
      `${BASE_URL}/demand`,
      {
        params: {
          category,
          product,
        },
      }
    );

  return response.data;

};

export const exportDemandForecastApi = (
  category = "All Categories",
  product = "All Products"
) => {

  const exportUrl =
    `${BASE_URL}/export?category=${encodeURIComponent(category)}&product=${encodeURIComponent(product)}`;

  window.open(
    exportUrl,
    "_blank"
  );

};