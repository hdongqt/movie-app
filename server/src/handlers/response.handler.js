import mongoose from "mongoose";
import { Constants } from "../helpers/constants.js";

const { RESPONSE_TYPE } = Constants;

const responseWithData = (res, statusCode, data) => {
  res.status(statusCode).json(data);
};

const errorRes = (res, error) => {
  if (
    (error && error instanceof mongoose.CastError) ||
    error.message.includes("Cast to ObjectId failed for value")
  ) {
    return notFound(res, "");
  }
  responseWithData(res, 500, {
    status: 500,
    message: "Oops! Đã xảy ra lỗi!",
  });
};

const badRequest = (res, message) =>
  responseWithData(res, 400, {
    status: 400,
    message,
  });

const unauthorized = (res, message) =>
  responseWithData(res, 401, {
    status: 401,
    message: message || "Truy cập bị từ chối. Vui lòng đăng nhập.",
  });

const forbidden = (res, message) =>
  responseWithData(res, 400, {
    status: 403,
    message: message || "Truy cập bị từ chối.",
  });

const notFound = (res, message) =>
  responseWithData(res, 404, {
    status: 404,
    message: message || "Không tìm thấy tài nguyên.",
  });

const generateError = (type, mess) => {
  const err = new Error();
  err.type = type;
  if (mess) err.message = mess;
  return err;
};

const buildResponseFailed = (res, error) => {
  const { type, message } = error;
  switch (type) {
    case Constants.RESPONSE_TYPE.BAD_REQUEST:
      badRequest(res, message);
      break;
    case Constants.RESPONSE_TYPE.NOT_FOUND:
      notFound(res, message);
      break;
    case Constants.RESPONSE_TYPE.FORBIDDEN:
      forbidden(res, message);
      break;
    case Constants.RESPONSE_TYPE.UNAUTHORIZED:
      unauthorized(res, message);
      break;
    default:
      errorRes(res, error);
  }
};

const buildResponseSuccess = (res, type, data) => {
  // 200 : ok - 201 :created
  const statusResponse = type === RESPONSE_TYPE.OK ? 200 : 201;
  const rep = { status: statusResponse };
  const { payload, message } = data;
  if (typeof data === "object" && data.hasOwnProperty("payload"))
    rep.payload = payload;
  if (typeof message === "string" && message) rep.message = message;
  responseWithData(res, statusResponse, rep);
};

export default {
  buildResponseFailed,
  buildResponseSuccess,
  generateError,
};
