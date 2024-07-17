import { Request, Response } from "express";
import { Branch } from "../DB/models/Models.js";
import { makeNDigitNumber } from "../utils/Utils.js";

export default class BranchRegistrationController {
  // The serial number of the last branch registered/added to DB.
  lastSn: number = 0;

  // Map to store error strings
  errorType: string = "";
  errorsMap: { [key: string]: string } = {
    FSSAI_ID_ALREADY_PRESENT: "FSSAI ID already associated with a branch.",
    GST_NO_ALREADY_PRESENT: "GST No. already associated with a branch.",
    BRANCH_NAME_ALREADY_PRESENT:
      "Branch name already associated with a branch.",
    CONTACT_NO_ALREADY_PRESENT: "Contact No. already associated with a branch.",
  };

  /**
   * Constructor of the class
   */
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
    const isFssaiPresent: boolean = (await Branch.findOne({
      fssai_no: request.body.fssai_no,
    })) as boolean;

    const isGstPresent: boolean = (await Branch.findOne({
      gst_no: request.body.gst_no,
    })) as boolean;

    const isBranchNamePresent: boolean = (await Branch.findOne({
      branch_name: request.body.branch_name,
    })) as boolean;

    const isContactNoPresent: boolean = (await Branch.findOne({
      contact_no: request.body.contact_no,
    })) as boolean;

    const branchId = await this.branchIdGenerator(request.body.branch_name);

    if (
      !isGstPresent &&
      !isFssaiPresent &&
      !isBranchNamePresent &&
      !isContactNoPresent
    ) {
      const newBranch = new Branch({
        serialNumber: this.lastSn + 1,
        branch_id: branchId,
        branch_name: request.body.branch_name,
        address: request.body.address,
        gst_no: request.body.gst_no,
        fssai_no: request.body.fssai_no,
        login_password: request.body.password,
        contact_no: request.body.contact_no,
        email_address: request.body.email_address,
      });

      await newBranch.save();

      return response.status(200).json({
        success: true,
        branchId: branchId,
      });
    } else {
      if (isBranchNamePresent) {
        this.errorType = "BRANCH_NAME_ALREADY_PRESENT";
      } else if (isContactNoPresent) {
        this.errorType = "CONTACT_NO_ALREADY_PRESENT";
      } else if (isGstPresent) {
        this.errorType = "GST_NO_ALREADY_PRESENT";
      } else if (isFssaiPresent) {
        this.errorType = "FSSAI_ID_ALREADY_PRESENT";
      }
      return response.status(404).json({
        success: false,
        error: this.errorsMap[this.errorType],
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
