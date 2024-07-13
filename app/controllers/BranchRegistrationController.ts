import { Request, Response } from "express";
import { Branch } from "../DB/models/Models.js";
import { makeNDigitNumber } from "../utils/Utils.js";

export default class BranchRegistrationController {
  lastSn: number = 0;

  errorsMap = {
    FSSAI_ID_ALREADY_PRESENT: "FSSAI ID already associated with a branch.",
  };

  constructor() {
    this.getLastEntrySn().then((lastEntrysn) => {
      this.lastSn = lastEntrysn;
    });
  }

  /**
   * Method to register a new branch
   * @param request REST api request
   * @param response REST api response
   * @returns Response with generated branch id
   */
  RegisterBranch = async (request: Request, response: Response) => {
    const isFssaiUnique: boolean = true; // To be implemented
    const branchId = await this.branchIdGenerator(request.body.branch_name);

    if (isFssaiUnique) {
      const newBranch = new Branch({
        serialNumber: this.lastSn + 1,
        branch_id: branchId,
        branch_name: request.body.branch_name,
        address: request.body.address,
        gst_no: request.body.gst_no,
        fssai_no: request.body.fssai_no,
        login_password: request.body.password,
      });

      await newBranch.save();

      return response.status(200).json({
        success: true,
        branchId: branchId,
      });
    } else {
      return response.status(404).json({
        success: false,
        error: this.errorsMap.FSSAI_ID_ALREADY_PRESENT,
      });
    }
  };

  /**
   * Method to generate branch id while registration
   * @param branchName branchName - Name of the branch to be registered
   * @returns Unique branchId
   */
  branchIdGenerator = async (branchName: string) => {
    let branchId: string = "";
    branchName.split(" ").map((element: string) => {
      branchId += element.charAt(0);
    });

    return `SMB${branchId}${makeNDigitNumber(this.lastSn + 1, 4)}`;
  };

  /**
   * Method to get Serial number of last entry
   * @returns Serial number of last entry
   */
  getLastEntrySn = async () => {
    let lastSn = 0;
    await Branch.findOne()
      .sort({ serialNumber: -1 })
      .limit(1)
      .then((latestEntry) => {
        if (latestEntry) {
          lastSn = latestEntry.serialNumber as number;
        } else {
          console.log("No branches found");
        }
      })
      .catch((err: Error) => {
        console.log(err);
      });
    return lastSn;
  };
}
