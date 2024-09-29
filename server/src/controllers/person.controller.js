import responseHandler from "../handlers/response.handler.js";
import PersonService from "../services/person.service.js";
import { Constants } from "../helpers/constants.js";
const { RESPONSE_TYPE, STATUS } = Constants;

const PeopleController = {};

PeopleController.getPerson = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = await PersonService.getPerson(id);
    if (!payload) {
      return responseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.NOT_FOUND,
        message: "Person not found",
      });
    }
    responseHandler.buildResponseSuccess(res, RESPONSE_TYPE.OK, {
      payload: payload,
    });
  } catch (error) {
    console.log(error);
    responseHandler.buildResponseFailed(res, error);
  }
};

export default PeopleController;
