import responseHandler from "../handlers/response.handler.js";
import CountryService from "./../services/country.service.js";
import { Constants } from "../helpers/constants.js";
import COMMON_HELPERS from "./../helpers/common.js";

const { RESPONSE_TYPE, STATUS } = Constants;

const CountryController = {};

CountryController.fetchAllCountry = async (req, res) => {
  try {
    const { status = STATUS.ALL } = req.query;
    const convertDataForPagination =
      await COMMON_HELPERS.convertDataForPaginate(req.query);
    const payload = await CountryService.fetchAllCountry(
      convertDataForPagination.pagination,
      convertDataForPagination.searchQuery
    );
    responseHandler.buildResponseSuccess(res, RESPONSE_TYPE.OK, {
      payload: payload,
    });
  } catch (error) {
    console.log(error);
    responseHandler.buildResponseFailed(res, error);
  }
};

CountryController.getCountry = async (req, res) => {
  try {
    const role = "admin";
    const { id } = req.params;
    const payload = await CountryService.getCountry(id);
    if (!payload) {
      return responseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.NOT_FOUND,
        message: "Country not found",
      });
    }
    if (role !== "admin" && payload?.status !== STATUS.ACTIVE) {
      return responseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.NOT_FOUND,
        message: "Genre not found",
      });
    }
    responseHandler.buildResponseSuccess(res, RESPONSE_TYPE.OK, {
      payload: payload,
    });
  } catch (error) {
    responseHandler.buildResponseFailed(res, error);
  }
};

CountryController.createCountry = async (req, res) => {
  try {
    const { name } = req.body;
    const existCountry = await CountryService.Country.find({
      name: { $regex: name.toLowerCase(), $options: "i" },
    });
    if (existCountry)
      return responseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.BAD_REQUEST,
        message: "Country already existed",
      });
    const country = await CountryService.createCountry({ name });
    responseHandler.buildResponseSuccess(res, RESPONSE_TYPE.CREATED, {
      payload: country,
    });
  } catch (error) {
    responseHandler.buildResponseFailed(res, error);
  }
};

CountryController.updateCountry = async (req, res) => {
  try {
    const { id } = req.params;
    const country = await CountryService.Country.findById(id);
    if (!country) {
      return responseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.BAD_REQUEST,
        message: "Country not found",
      });
    }
    const payload = await CountryService.updateCountry(country, req.body);
    responseHandler.buildResponseSuccess(res, RESPONSE_TYPE.OK, {
      payload: payload,
    });
  } catch (error) {
    console.log(error);
    responseHandler.buildResponseFailed(res, error);
  }
};

CountryController.deactivateCountry = async (req, res) => {
  try {
    const { id } = req.params;
    const actor = await CountryService.Country.findById(id);
    if (!actor) {
      return responseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.NOT_FOUND,
        message: "Country not found",
      });
    }
    if (actor.status === STATUS.INACTIVE) {
      return responseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.BAD_REQUEST,
        message: "Country has a status as inactive",
      });
    }
    await CountryService.updateCountryStatus(actor, STATUS.INACTIVE);
    responseHandler.buildResponseSuccess(res, RESPONSE_TYPE.OK, {
      message: "Deactivate actor successfully",
    });
  } catch (error) {
    console.log(error);
    responseHandler.buildResponseFailed(res, error);
  }
};

CountryController.activateCountry = async (req, res) => {
  try {
    const { id } = req.params;
    const country = await CountryService.Country.findById(id);
    if (!country) {
      return responseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.NOT_FOUND,
        message: "Country not found",
      });
    }
    if (country.status === STATUS.ACTIVE) {
      return responseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.BAD_REQUEST,
        message: "Country has a status as active",
      });
    }
    await CountryService.updateCountryStatus(country, STATUS.ACTIVE);
    responseHandler.buildResponseSuccess(res, RESPONSE_TYPE.OK, {
      message: "Activate actor successfully",
    });
  } catch (error) {
    responseHandler.buildResponseFailed(res, error);
  }
};

export default CountryController;
