import { Request, Response } from "express";
import { Product } from "../DB/models/Models.js";

export const getItems = async (request: Request, response: Response) => {
  let products = await Product.find({ category: request.params.category });
  console.log("Getting products: ", request.params.category);
  response.send(products);
};

export const getAllItems = async (request: Request, response: Response) => {
  let products = await Product.find({});
  console.log("Getting all products.");
  response.send(products);
};
// app.post("/api/addproduct", async (req, res) => {
//   let products = await Product.find({});
//   let id;
//   if (products.length > 0) {
//     let last_product_array = products.slice(-1);
//     let last_product = last_product_array[0];
//     id = last_product.id + 1;
//   } else {
//     id = 1;
//   }
//   const product = new Product({
//     id: id,
//     name: req.body.name,
//     image: req.body.image,
//     category: req.body.category,
//     market_retail_price: req.body.retail_price,
//     shoora_price: req.body.shoora_price,
//     purchase_value: req.body.purchase_value,
//     available: req.body.available,
//     tax_rate: req.body.tax_rate,
//   });
//   console.log(product);
//   await product.save();
//   console.log("Saved");
//   res.json({ success: true, name: req.body.name });
// });

// app.post("/api/removeproduct", async (req, res) => {
//   const product = await Product.findOneAndDelete({ id: req.body.id });
//   console.log("Removed");
//   res.json({ success: true, name: req.body.name });
// });
