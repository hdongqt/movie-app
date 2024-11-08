import ResponseHandler from "../handlers/response.handler.js";
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
    ResponseHandler.buildResponseSuccess(res, RESPONSE_TYPE.OK, {
      payload: payload,
    });
  } catch (error) {
    console.log(error);
    ResponseHandler.buildResponseFailed(res, error);
  }
};

CountryController.getCountry = async (req, res) => {
  try {
    const role = "admin";
    const { id } = req.params;
    const payload = await CountryService.getCountry(id);
    if (!payload) {
      return ResponseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.NOT_FOUND,
        message: "Country not found",
      });
    }
    if (role !== "admin" && payload?.status !== STATUS.ACTIVE) {
      return ResponseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.NOT_FOUND,
        message: "Genre not found",
      });
    }
    ResponseHandler.buildResponseSuccess(res, RESPONSE_TYPE.OK, {
      payload: payload,
    });
  } catch (error) {
    ResponseHandler.buildResponseFailed(res, error);
  }
};

CountryController.createCountry = async (req, res) => {
  try {
    const { name } = req.body;
    const existCountry = await CountryService.Country.find({
      name: { $regex: name.toLowerCase(), $options: "i" },
    });
    if (existCountry)
      return ResponseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.BAD_REQUEST,
        message: "Country already existed",
      });
    const country = await CountryService.createCountry({ name });
    ResponseHandler.buildResponseSuccess(res, RESPONSE_TYPE.CREATED, {
      payload: country,
    });
  } catch (error) {
    ResponseHandler.buildResponseFailed(res, error);
  }
};

CountryController.updateCountry = async (req, res) => {
  try {
    const { id } = req.params;
    const country = await CountryService.Country.findById(id);
    if (!country) {
      return ResponseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.BAD_REQUEST,
        message: "Country not found",
      });
    }
    const payload = await CountryService.updateCountry(country, req.body);
    ResponseHandler.buildResponseSuccess(res, RESPONSE_TYPE.OK, {
      payload: payload,
    });
  } catch (error) {
    console.log(error);
    ResponseHandler.buildResponseFailed(res, error);
  }
};

CountryController.deactivateCountry = async (req, res) => {
  try {
    const { id } = req.params;
    const actor = await CountryService.Country.findById(id);
    if (!actor) {
      return ResponseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.NOT_FOUND,
        message: "Country not found",
      });
    }
    if (actor.status === STATUS.INACTIVE) {
      return ResponseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.BAD_REQUEST,
        message: "Country has a status as inactive",
      });
    }
    await CountryService.updateCountryStatus(actor, STATUS.INACTIVE);
    ResponseHandler.buildResponseSuccess(res, RESPONSE_TYPE.OK, {
      message: "Deactivate actor successfully",
    });
  } catch (error) {
    console.log(error);
    ResponseHandler.buildResponseFailed(res, error);
  }
};

CountryController.activateCountry = async (req, res) => {
  try {
    const { id } = req.params;
    const country = await CountryService.Country.findById(id);
    if (!country) {
      return ResponseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.NOT_FOUND,
        message: "Country not found",
      });
    }
    if (country.status === STATUS.ACTIVE) {
      return ResponseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.BAD_REQUEST,
        message: "Country has a status as active",
      });
    }
    await CountryService.updateCountryStatus(country, STATUS.ACTIVE);
    ResponseHandler.buildResponseSuccess(res, RESPONSE_TYPE.OK, {
      message: "Activate actor successfully",
    });
  } catch (error) {
    ResponseHandler.buildResponseFailed(res, error);
  }
};

export default CountryController;
