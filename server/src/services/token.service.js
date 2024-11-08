import ResponseHandler from "../handlers/response.handler.js";
import { Constants } from "../helpers/constants.js";
import _ from "lodash";
import RefreshToken from "../models/refreshToken.model.js";
import jsonwebtoken from "jsonwebtoken";
const TokenService = {};

TokenService.RefreshToken = RefreshToken;

TokenService.createAccessToken = async (user) => {
  return await jsonwebtoken.sign({ data: user.id }, process.env.TOKEN_SECRET, {
    expiresIn: 60 * 60 * 24,
  });
};

TokenService.createRefreshToken = async (user) => {
  const token = await jsonwebtoken.sign(
    { data: user.id },
    process.env.TOKEN_SECRET,
    {
      expiresIn: 60 * 60 * 24 * 30,
    }
  );

  await RefreshToken.create({
    token: token,
    userId: user.id,
  });
  return token;
};

export default TokenService;
