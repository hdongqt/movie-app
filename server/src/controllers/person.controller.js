import ResponseHandler from "../handlers/response.handler.js";
import PersonService from "../services/person.service.js";
import { Constants } from "../helpers/constants.js";
const { RESPONSE_TYPE, STATUS } = Constants;

const PeopleController = {};

PeopleController.getPerson = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = await PersonService.getPerson(id);
    if (!payload) {
      return ResponseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.NOT_FOUND,
        message: "Person not found",
      });
    }
    ResponseHandler.buildResponseSuccess(res, RESPONSE_TYPE.OK, {
      payload: payload,
    });
  } catch (error) {
    ResponseHandler.buildResponseFailed(res, error);
  }
};

export default PeopleController;
