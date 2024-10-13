import userModel from "../models/user.model.js";
import jsonwebtoken from "jsonwebtoken";
import responseHandler from "../handlers/response.handler.js";

import { Constants } from "../helpers/constants.js";
import COMMON_HELPERS from "../helpers/common.js";
import _ from "lodash";
import UserService from "./../services/user.service.js";
import TokenService from "../services/token.service.js";

const { RESPONSE_TYPE, STATUS } = Constants;

const AuthController = {};

AuthController.SignUp = async (req, res) => {
  try {
    const { email } = req.body;

    const isHasUser = await UserService.findOneByEmail(email);

    if (isHasUser)
      return responseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.BAD_REQUEST,
        message: "Email đã tồn tại",
      });

    await UserService.createUser(req.body);

    responseHandler.buildResponseSuccess(res, RESPONSE_TYPE.CREATED, {
      message: "Đăng ký tài khoản thành công",
    });
  } catch (error) {
    console.log(error);
    responseHandler.buildResponseFailed(res, error);
  }
};

AuthController.SignIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserService.findOneByEmail(email);
    if (!user)
      return responseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.BAD_REQUEST,
        message: "Người dùng không tồn tại",
      });
    if (!user.validPassword(password))
      return responseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.BAD_REQUEST,
        message: "Sai mật khẩu",
      });
    if (user.status !== Constants.STATUS.ACTIVE)
      return responseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.BAD_REQUEST,
        message: "Tài khoản đã bị vô hiệu hoá",
      });
    const accessToken = await TokenService.createAccessToken(user);
    const refreshToken = await TokenService.createRefreshToken(user);

    const infoUser = _.omit(user._doc, [
      "password",
      "salt",
      "_id",
      "favorites",
    ]);
    responseHandler.buildResponseSuccess(res, RESPONSE_TYPE.CREATED, {
      payload: {
        tokens: {
          accessToken,
          refreshToken,
        },
        user: {
          ...infoUser,
          id: user.id,
        },
      },
    });
  } catch (error) {
    console.log(error);
    responseHandler.buildResponseFailed(res, error);
  }
};

AuthController.UpdatePassword = async (req, res) => {
  try {
    const { password, newPassword } = req.body;

    const user = await userModel
      .findById(req.user.id)
      .select("password id salt");

    if (!user) return responseHandler.unauthorize(res);

    if (!user.validPassword(password))
      return responseHandler.badrequest(res, "Sai mật khẩu");

    user.setPassword(newPassword);

    await user.save();

    responseHandler.ok(res);
  } catch (error) {
    responseHandler.buildResponseFailed(res, error);
  }
};

AuthController.GetInfo = async (req, res) => {
  try {
    const user = await UserService.findById(req.user.id);
    if (!user)
      return responseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.NOT_FOUND,
        message: "Tài khoản không tồn tại",
      });
    const { _id, ...result } = user._doc;
    responseHandler.buildResponseSuccess(res, RESPONSE_TYPE.OK, {
      payload: {
        ...result,
        id: _id,
      },
    });
  } catch (error) {
    console.log(error);
    responseHandler.buildResponseFailed(res, error);
  }
};

AuthController.LogOut = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const userRT = jsonwebtoken.verify(refreshToken, process.env.TOKEN_SECRET);
    //check refreshToken
    if (!userRT || (userRT && userRT.data !== req.user.id))
      return responseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.BAD_REQUEST,
        message: "Token không hợp lệ",
      });
    //find and delete in db
    const findAndDeleteToken = await TokenService.RefreshToken.findOneAndDelete(
      { token: refreshToken }
    );
    if (!findAndDeleteToken)
      return responseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.BAD_REQUEST,
        message: "Token không hợp lệ",
      });
    return responseHandler.buildResponseSuccess(res, RESPONSE_TYPE.OK, {
      message: "Đăng xuất thành công",
    });
  } catch (error) {
    responseHandler.buildResponseFailed(res, error);
  }
};

AuthController.RefreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const tokenDecode = COMMON_HELPERS.tokenDecode(refreshToken);
    if (!tokenDecode) {
      return responseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.BAD_REQUEST,
        message: "Token không hợp lệ",
      });
    }
    const tokenFound = await TokenService.RefreshToken.findOne({
      token: refreshToken,
    });

    if (!tokenFound)
      return responseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.UNAUTHORIZED,
        message: "Token không hợp lệ",
      });
    const accessToken = jsonwebtoken.sign(
      { data: tokenFound.userId },
      process.env.TOKEN_SECRET,
      {
        expiresIn: 60 * 60 * 24,
      }
    );
    return responseHandler.buildResponseSuccess(res, RESPONSE_TYPE.OK, {
      payload: { accessToken },
    });
  } catch (error) {
    responseHandler.buildResponseFailed(res, error);
  }
};

export default AuthController;
