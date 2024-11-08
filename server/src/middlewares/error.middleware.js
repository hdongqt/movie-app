import ResponseHandler from "../handlers/response.handler.js";
import { Constants } from "../helpers/constants.js";

//check body json object
const handleErrorBodyPost = (err, _, res, next) => {
  // if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
  //   const { body, type } = err;
  //   return ResponseHandler.buildResponseFailed(res, {
  //     type: Constants.RESPONSE_TYPE.BAD_REQUEST,
  //     message: `${body.replace(/[\r\n\s]+/g, "")} - ${type}`,
  //   });
  // }
  // next();
};

export default { handleErrorBodyPost };
