import { Request, Response } from "express";
import { Product } from "../DB/models/models.js";

export const getItems = async (request: Request, response: Response) => {
  let products = await Product.find({ category: request.params.category });
  console.log("Getting products: ", request.params.category);
  response.send(products);
};

export const getAllItems = async (request: Request, response: Response) => {
  let products = await Product.find();
  console.log("Getting all products.");
  response.send(products);
};

export const updateItemAvailability = async (
  request: Request,
  response: Response
) => {
  const { productId, isAvailable } = request.body;
  await Product.findOneAndUpdate({ id: productId }, { available: isAvailable });
  console.log("Update item availability");
  response.json({ success: true });
};

export const updateItemDetails = async (
  request: Request,
  response: Response
) => {
  const {
    id,
    name,
    category,
    retail_price,
    shoora_price,
    purchase_value,
    tax_rate,
    quantity_unit,
    quantity_value,
    available,
  } = request.body;
  console.log(request.body);

  try {
    await Product.findOneAndUpdate(
      { id: id },
      {
        name: name,
        category: category,
        market_retail_price: retail_price,
        shoora_price,
        purchase_value,
        tax_rate,
        quantity_unit,
        quantity_value,
        available,
      }
    );
    response.json({ success: true });
  } catch (error) {
    console.log("Error while updating item details: ", error);
    response.json({ success: false, error: error });
  }
};
