import { Request, Response } from "express";
import { KycModel } from "../DB/models/kyc.model.js";

/**
 * Method to get the kyc information for a given user's smId
 * @param request
 * @param response
 */
export const getKycDetails = async (request: Request, response: Response) => {
  const { smId } = request.body;
  try {
    const details = await KycModel.findOne({ smId: smId });

    response.json({ success: true, details });
  } catch (error) {
    response.json({ success: false, error });
  }
};

/**
 * Method to get the kyc information for a all user's who have submitted kyc
 * @param request
 * @param response
 */
export const getAllKycDetails = async (
  request: Request,
  response: Response
) => {
  try {
    const details = await KycModel.find({});

    response.json({ success: true, details });
  } catch (error) {
    response.json({ success: false, error });
  }
};

/**
 * Method to publish the kyc details for a given user's smId
 * @param request
 * @param response
 */
export const publishKycDetails = async (
  request: Request,
  response: Response
) => {
  try {
    const { smId, details, isVerified } = request.body.kycDetails;
    await KycModel.findOneAndUpdate(
      { smId: smId },
      { smId: smId, details: details, isVerified: isVerified },
      {
        upsert: true,
        new: true,
        runValidators: true,
      }
    );

    response.json({ success: true });
  } catch (error) {
    response.json({ success: false, error });
  }
};

/**
 * Method to check if kyc completed for a given user's smId
 * @param request
 * @param response
 */
export const isKycComplete = async (request: Request, response: Response) => {
  try {
    const { smId } = request.body;
    const details = await KycModel.findOne({ smId: smId });

    response.json({ success: true, isKycComplete: details?.isVerified });
  } catch (error) {
    response.json({ success: false, error });
  }
};
