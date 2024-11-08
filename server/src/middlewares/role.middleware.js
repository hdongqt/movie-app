import ResponseHandler from "../handlers/response.handler.js";
import { Constants } from "../helpers/constants.js";

const allowedUrls = ["/api/v1/country/", "/api/comments", "/api/profile"];

export const checkRoleAndStatus = () => {
  return (req, res, next) => {
    const role = "admin";
    const { status = Constants.STATUS.ALL } = req.query;
    const currentUrl = `${req.baseUrl}${req.path}`;
    if (allowedUrls.includes(currentUrl)) {
      if (role === "admin") {
        return next();
      } else {
        if (status && status !== "active") {
          return ResponseHandler.buildResponseFailed(res, {
            type: Constants.RESPONSE_TYPE.FORBIDDEN,
            message: "Forbidden ",
          });
        }
        return next();
      }
    }
    return next();
  };
};
