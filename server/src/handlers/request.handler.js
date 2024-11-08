import { validationResult } from "express-validator";
import { Constants } from "../helpers/constants.js";
import ResponseHandler from "./response.handler.js";

const { RESPONSE_TYPE } = Constants;

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const messageResult = errors
      .array()
      .map((err) => err.msg)
      .join("\n");
    return ResponseHandler.buildResponseFailed(res, {
      type: RESPONSE_TYPE.BAD_REQUEST,
      message: messageResult,
    });
  }

  next();
};

export default { validate };
