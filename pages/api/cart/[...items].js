import products from "../../../data/products.json";

export default function handler(req, res) {
  const { items } = req.query;
  const cartProduct = [];
  items.length && items.map((sitem) => {
    const arr = sitem.split("_");
    if (arr.length > 1) {
      const itemObj = {
        id: arr[0],
        quantity: arr[1]
      }
  
      const result = products.find( ({ id }) => id === Number(itemObj.id) );
      result.quantity = itemObj.quantity
      cartProduct.push(result);
    }
  });
  
  res.status(200).json(cartProduct)
}