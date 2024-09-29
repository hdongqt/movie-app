import responseHandler from "../handlers/response.handler.js";
import UserService from "./../services/user.service.js";
import { Constants } from "../helpers/constants.js";
const { RESPONSE_TYPE, STATUS } = Constants;
import COMMON_HELPERS from "../helpers/common.js";

const UserController = {};

UserController.fetchAllUser = async (req, res) => {
  try {
    const { status = STATUS.ALL } = req.query;

    const convertDataForPagination =
      await COMMON_HELPERS.convertDataForPaginate(req.query);
    const payload = await UserService.fetchAllUser(
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

UserController.getUser = async (req, res) => {
  try {
    const { id } = req.params;

    const payload = await UserService.getUser(id);
    if (!payload) {
      return responseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.NOT_FOUND,
        message: "Không tìm thấy người dùng",
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

UserController.activateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserService.findByIdByAdmin(id);
    if (!user) {
      return responseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.NOT_FOUND,
        message: "Người dùng không tồn tại",
      });
    }
    if (user.status === STATUS.ACTIVE) {
      return responseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.BAD_REQUEST,
        message: "Người dùng đã ở trạng thái hoạt động",
      });
    }
    const result = await UserService.updateUserStatus(user, STATUS.ACTIVE);
    responseHandler.buildResponseSuccess(res, RESPONSE_TYPE.OK, {
      message: "Kích hoạt người dùng thành công",
      payload: result,
    });
  } catch (error) {
    console.log(error);
    responseHandler.buildResponseFailed(res, error);
  }
};

UserController.deactivateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserService.findByIdByAdmin(id);
    if (!user) {
      return responseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.NOT_FOUND,
        message: "Người dùng không tồn tại",
      });
    }
    if (user.status === STATUS.INACTIVE) {
      return responseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.BAD_REQUEST,
        message: "Người dùng đã ở trạng thái vô hiệu hoá",
      });
    }
    const result = await UserService.updateUserStatus(user, STATUS.INACTIVE);
    responseHandler.buildResponseSuccess(res, RESPONSE_TYPE.OK, {
      message: "Vô hiệu hoá người dùng thành công",
      payload: result,
    });
  } catch (error) {
    console.log(error);
    responseHandler.buildResponseFailed(res, error);
  }
};

UserController.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserService.User.findById(id);
    if (!user) {
      return responseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.BAD_REQUEST,
        message: "Không tìm thấy người dùng",
      });
    }
    const payload = await UserService.updateUser(user, req.body);
    responseHandler.buildResponseSuccess(res, RESPONSE_TYPE.OK, {
      payload: payload,
    });
  } catch (error) {
    console.log(error);
    responseHandler.buildResponseFailed(res, error);
  }
};

export default UserController;
