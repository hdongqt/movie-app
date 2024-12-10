import { Constants } from "../helpers/constants.js";
import UserService from "../services/user.service.js";
import ResponseHandler from "../handlers/response.handler.js";
import COMMON_HELPERS from "./../helpers/common.js";

const decodeTokenHeader = (req) => {
  try {
    const bearerHeader = req.headers["authorization"];
    if (bearerHeader) {
      const token = bearerHeader.split(" ")[1];
      return COMMON_HELPERS.tokenDecode(token);
    }
    return false;
  } catch {
    return false;
  }
};

const auth = async (req, res, next) => {
  const tokenDecoded = decodeTokenHeader(req);
  if (!tokenDecoded) {
    return ResponseHandler.buildResponseFailed(res, {
      type: Constants.RESPONSE_TYPE.UNAUTHORIZED,
    });
  } else {
    const user = await UserService.findById(tokenDecoded.data);
    if (!user)
      return ResponseHandler.buildResponseFailed(res, {
        type: Constants.RESPONSE_TYPE.UNAUTHORIZED,
      });
    req.user = user;
  }
  next();
};

const checkIsAdmin = async (req, res, next) => {
  await auth(req, res, async () => {
    if (req?.user && req.user.role !== "admin") {
      return ResponseHandler.buildResponseFailed(res, {
        type: Constants.RESPONSE_TYPE.FORBIDDEN,
        message: "Không có quyền truy cập",
      });
    }
    next();
  });
};

export default { auth, checkIsAdmin };
