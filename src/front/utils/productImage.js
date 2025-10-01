import productImages from "../../../docs/product_images.json";

export function getProductImage(name) {
  return productImages[name] || null;
}
