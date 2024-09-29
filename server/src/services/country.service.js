import responseHandler from "../handlers/response.handler.js";
import Country from "../models/country.model.js";
import { Constants } from "../helpers/constants.js";
import _ from "lodash";
import COMMON_HELPERS from "../helpers/common.js";
import TransactionService from "./transaction.service.js";
const { RESPONSE_TYPE } = Constants;

const CountryService = {};

CountryService.Country = Country;

CountryService.fetchAllCountry = async (paginationOptions, payload) => {
  const { status = Constants.STATUS.ACTIVE, keyword } = payload;
  const select = "";
  let queryOp = {};
  if (status) queryOp.status = status;
  if (keyword) queryOp.name = { $regex: new RegExp(keyword, "i") };
  return await COMMON_HELPERS.paginateData({
    model: Country,
    queryOptions: queryOp,
    paginationOptions: paginationOptions,
    select: select,
  });
};

CountryService.getCountry = async (id) => {
  const country = await Country.findById(id);
  if (!country) {
    return null;
  }
  return country.toJSON();
};

CountryService.createCountry = async (payload) => {
  const { name } = payload;
  const country = new Country({
    name: name,
  });
  const countrySave = await country.save();
  return {
    ...countrySave._doc,
    id: countrySave.id,
  };
};

CountryService.updateCountry = async (country, payload) => {
  const { name } = payload;
  if (country?.name.toLowerCase() !== name.toLowerCase()) {
    const findCountry = await Country.find({
      name: { $regex: name.toLowerCase(), $options: "i" },
    });
    if (findCountry && findCountry.length > 0)
      throw responseHandler.generateError(
        RESPONSE_TYPE.BAD_REQUEST,
        "Country name already existed"
      );
  }

  Object.assign(country, {
    name: name,
  });
  const countrySave = await country.save();
  return {
    ...countrySave._doc,
    id: countrySave.id,
  };
};

CountryService.updateCountryStatus = async (country, status) => {
  Object.assign(country, {
    status: status,
  });
  const countrySave = await country.save();
  return {
    ...countrySave._doc,
    id: countrySave.id,
  };
};

CountryService.saveNewListCountries = async (listCountries) => {
  const session = TransactionService.getSession();
  if (listCountries) {
    let countryIds = [];
    for (const countryName of listCountries) {
      let country =
        (await Country.findOne({
          name: { $regex: new RegExp("^" + countryName + "$", "i") },
        })) || (await Country.create([{ name: countryName }], { session }))[0];
      countryIds.push(country._id);
    }
    return countryIds;
  }
  return [];
};

export default CountryService;
