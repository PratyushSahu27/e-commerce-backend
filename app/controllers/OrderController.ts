import { request, Request, Response } from "express";
import { Branch, Orders, Users } from "../DB/models/models.js";
import { orderStatus, transactionStatus } from "../utils/order.util.js";
import axios from "axios";

const APP_BACKEND_URL = process.env.BACKEND_URL;

export const getOrders = async (request: Request, response: Response) => {
  try {
    const params = request.body.smId
      ? { smId: request.body.smId }
      : { branchId: request.body.branchId };
    const orders = await Orders.find(params);
    response.send({ success: true, orders: orders });
  } catch (error) {
    console.log("Error fetching orders: ", error);
    response.json({ success: false });
  }
};

export const placeOrder = async (request: Request, response: Response) => {
  const user = await Users.findOne({ smId: request.body.smId });
  const order = new Orders({
    mode: request.body.mode,
    buyer_name: user?.name,
    buyer_contact: user?.phoneNumber,
    branchId: request.body.branchId,
    orderId: request.body.orderId,
    orderItems: request.body.orderItems,
    smId: request.body.smId,
    orderValue: request.body.orderValue,
    orderPurchaseValue: request.body.orderPurchaseValue,
    deliveryCharge: request.body.deliveryCharge,
    address: request.body.address,
    status: request.body.status ?? orderStatus.INITIATED,
    alternateContactNumber: request.body.alternateContactNumber,
    transactionId: request.body.transactionId ?? "",
    transactionStatus:
      request.body.transactionStatus ?? transactionStatus.INITIATED,
  });

  await order.save();
  console.log("Order placed successfully!");
  response.json({ success: true });
};

export const updateOrderStatus = async (
  request: Request,
  response: Response
) => {
  const { orderId, status } = request.body;
  try {
    const order = await Orders.findOne({ orderId: orderId });

    if (order?.status !== "COMPLETED" && status === "COMPLETED") {
      await Users.findOneAndUpdate(
        { smId: request.body.smId },
        { $inc: { total_pv: request.body.orderPurchaseValue } }
      );
    }

    if (status === "CONFIRMED" || status === "COMPLETED") {
      await Users.findOneAndUpdate(
        { smId: request.body.smId },
        { isActive: true }
      );
    }

    await Orders.findOneAndUpdate({ orderId: orderId }, { status: status });
    response.json({ success: true });
  } catch (error) {
    console.log("Error updating order status - ", error);
    response.json({ success: false, error });
  }
};

export const updateOrderTransactionStatus = async (
  request: Request,
  response: Response
) => {
  const { transactionId, status } = request.body;
  try {
    if (status === "PAYMENT_SUCCESS") {
      const order = await Orders.findOneAndUpdate(
        { transactionId: transactionId },
        {
          transactionStatus: transactionStatus.SUCCESS,
          status: orderStatus.CONFIRMED,
        }
      );
      order &&
        (await Users.findOneAndUpdate(
          { smId: order.smId },
          { isActive: true }
        ));
    } else if (
      status === "INTERNAL_SERVER_ERROR" ||
      status === "PAYMENT_PENDING"
    ) {
      await Orders.findOneAndUpdate(
        { transactionId: transactionId },
        {
          transactionStatus: transactionStatus.PENDING,
        }
      );
    } else if (status === "TIMED_OUT" || status === "PAYMENT_ERROR") {
      await Orders.findOneAndUpdate(
        { transactionId: transactionId },
        {
          transactionStatus: transactionStatus.FAILED,
          status: orderStatus.DECLINED,
        }
      );
    } else if (status === "PAYMENT_DECLINED") {
      await Orders.findOneAndUpdate(
        { transactionId: transactionId },
        {
          transactionStatus: transactionStatus.DECLINED,
          status: orderStatus.DECLINED,
        }
      );
    } else {
      await Orders.findOneAndUpdate(
        { transactionId: transactionId },
        {
          transactionStatus: status,
          orderStatus: orderStatus.DECLINED,
        }
      );
    }

    response.json({ success: true });
  } catch (error) {
    console.log("Error updating order status - ", error);
    response.json({ success: false, error });
  }
};

export const updateOrderTransactionId = async (
  request: Request,
  response: Response
) => {
  const { orderId, transactionId } = request.body;
  try {
    await Orders.findOneAndUpdate(
      { orderId: orderId },
      { transactionId: transactionId }
    );

    response.json({ success: true });
  } catch (error) {
    console.log("Error updating order transaction ID - ", error);
    response.json({ success: false, error });
  }
};

export const markOrderAsCompleted = async (
  request: Request,
  response: Response
) => {
  const { orderId, deliveryDocketNumber, deliveryServiceName } = request.body;

  try {
    const order = await Orders.findOneAndUpdate(
      { orderId: orderId },
      {
        status: orderStatus.COMPLETED,
        deliveryDocketNumber,
        deliveryServiceName,
      }
    );

    let user;
    if (order) {
      user = await Users.findOneAndUpdate(
        { smId: order.smId },
        { $inc: { total_pv: order.orderPurchaseValue } }
      );
    }

    const branch = await Branch.findOne({ branch_id: order?.branchId });

    const options = {
      url: `${APP_BACKEND_URL}/generateinvoice`,
      method: "POST",
      headers: {
        Accept: "application/form-data",
        "Content-Type": "application/json",
      },
      data: {
        orderId: order?.orderId,
        orderDate: order?.orderDate,
        user: {
          smId: user?.smId,
          name: user?.name,
          phoneNumber: user?.phoneNumber,
          address: order?.address,
          gst_number: "",
        },
        seller: branch,
        orderItems: order?.orderItems,
        orderValue: order?.orderValue,
        deliveryCharge: order?.deliveryCharge,
      },
    };

    await axios(options);

    response.json({ success: true });
  } catch (error) {
    console.log("Error marking order as completed - ", error);
    response.json({ success: false, error });
  }
};
