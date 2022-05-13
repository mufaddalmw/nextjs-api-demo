import products from "../../../data/products.json";

export default function handler(req, res) {
  const { pid } = req.query
  const result = products.find( ({ id }) => id === Number(pid) );
  console.log(result);
  res.status(200).json(result);
}