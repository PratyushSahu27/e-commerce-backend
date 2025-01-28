import { Product } from "../DB/models/models";
import { Request, Response } from "express";

export const addProduct = async (request: Request, response: Response) => {
  try {
    let products = await Product.find({});
    let id;
    if (products.length > 0) {
      let last_product_array = products.slice(-1);
      let last_product = last_product_array[0];
      id = last_product.id + 1;
    } else {
      id = 1;
    }
    const product = new Product({
      id: id,
      name: request.body.name,
      image: request.body.image,
      category: request.body.category,
      market_retail_price: request.body.retail_price,
      shoora_price: request.body.shoora_price,
      purchase_value: request.body.purchase_value,
      available: request.body.available,
      tax_rate: request.body.tax_rate,
      quantity_value: request.body.quantity_value,
      quantity_unit: request.body.quantity_unit,
    });
    console.log(product);
    await product.save();
    console.log("Saved");
    response.json({ success: true, name: request.body.name });
  } catch {
    return response.status(400).json({
      success: false,
      errors: "Failed to add product",
    });
  }
};

export const removeProduct = async (request: Request, response: Response) => {
  try {
    await Product.findOneAndDelete({ id: request.body.id });
    console.log("Removed");
    response.json({ success: true, name: request.body.name });
  } catch {
    return response.status(400).json({
      success: false,
      errors: "Failed to remove product",
    });
  }
};

export const getAllProducts = async (response: Response) => {
  console.log("All Products");
  try {
    response.send({ success: true, product: await Product.find({}) });
  } catch {
    return response.status(400).json({
      success: false,
      errors: "Failed to get all products",
    });
  }
};

export const getNewCollections = async (response: Response) => {
  console.log("New Collections");

  try {
    let products = await Product.find({});
    response.send({ products: products.slice(1).slice(-8) });
  } catch {
    return response.status(400).json({
      success: false,
      errors: "Failed to get all products",
    });
  }
};
