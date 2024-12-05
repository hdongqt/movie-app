import ResponseHandler from "../handlers/response.handler.js";
import UserService from "./../services/user.service.js";
import { Constants } from "../helpers/constants.js";
const { RESPONSE_TYPE, STATUS } = Constants;
import COMMON_HELPERS from "../helpers/common.js";
import MovieService from "./../services/movie.service.js";

const UserController = {};

UserController.fetchAllUser = async (req, res) => {
  try {
    const convertDataForPagination =
      await COMMON_HELPERS.convertDataForPaginate(req.query);
    const payload = await UserService.fetchAllUser(
      convertDataForPagination.pagination,
      convertDataForPagination.searchQuery
    );
    ResponseHandler.buildResponseSuccess(res, RESPONSE_TYPE.OK, {
      payload: payload,
    });
  } catch (error) {
    ResponseHandler.buildResponseFailed(res, error);
  }
};

UserController.getUser = async (req, res) => {
  try {
    const { id } = req.params;

    const payload = await UserService.getUser(id);
    if (!payload) {
      return ResponseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.NOT_FOUND,
        message: "Không tìm thấy người dùng",
      });
    }
    ResponseHandler.buildResponseSuccess(res, RESPONSE_TYPE.OK, {
      payload: payload,
    });
  } catch (error) {
    ResponseHandler.buildResponseFailed(res, error);
  }
};

UserController.activateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserService.findByIdByAdmin(id);
    if (!user) {
      return ResponseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.NOT_FOUND,
        message: "Người dùng không tồn tại",
      });
    }
    if (user.status === STATUS.ACTIVE) {
      return ResponseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.BAD_REQUEST,
        message: "Người dùng đã ở trạng thái hoạt động",
      });
    }
    const result = await UserService.updateUserStatus(user, STATUS.ACTIVE);
    ResponseHandler.buildResponseSuccess(res, RESPONSE_TYPE.OK, {
      message: "Kích hoạt người dùng thành công",
      payload: result,
    });
  } catch (error) {
    ResponseHandler.buildResponseFailed(res, error);
  }
};

UserController.deactivateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserService.findByIdByAdmin(id);
    if (!user) {
      return ResponseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.NOT_FOUND,
        message: "Người dùng không tồn tại",
      });
    }
    if (user.status === STATUS.INACTIVE) {
      return ResponseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.BAD_REQUEST,
        message: "Người dùng đã ở trạng thái vô hiệu hoá",
      });
    }
    const result = await UserService.updateUserStatus(user, STATUS.INACTIVE);
    ResponseHandler.buildResponseSuccess(res, RESPONSE_TYPE.OK, {
      message: "Vô hiệu hoá người dùng thành công",
      payload: result,
    });
  } catch (error) {
    ResponseHandler.buildResponseFailed(res, error);
  }
};

UserController.updateProfile = async (req, res) => {
  try {
    const { displayName } = req.body;
    const user = await UserService.findById(req?.user?.id);
    if (!user) {
      return ResponseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.UNAUTHORIZED,
        message: "Vui lòng đăng nhập",
      });
    }
    const payload = await UserService.updateUser(user, { displayName });
    ResponseHandler.buildResponseSuccess(res, RESPONSE_TYPE.OK, {
      payload: payload,
    });
  } catch (error) {
    ResponseHandler.buildResponseFailed(res, error);
  }
};

UserController.updatePassword = async (req, res) => {
  try {
    const user = await UserService.User.findOne({
      _id: req?.user?.id,
      status: "active",
    }).select("id password salt");
    if (!user) {
      return ResponseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.UNAUTHORIZED,
        message: "Vui lòng đăng nhập",
      });
    }

    const { password, newPassword } = req.body;
    if (!user.validPassword(password))
      return ResponseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.BAD_REQUEST,
        message: "Sai mật khẩu",
      });

    user.setPassword(newPassword);
    await user.save();
    ResponseHandler.buildResponseSuccess(res, RESPONSE_TYPE.OK, {
      message: "Thay đổi mật khẩu thành công",
    });
  } catch (error) {
    ResponseHandler.buildResponseFailed(res, error);
  }
};

UserController.fetchFavoriteMovies = async (req, res) => {
  try {
    const { pagination } = await COMMON_HELPERS.convertDataForPaginate(
      req.query
    );

    const payload = await UserService.fetchFavoriteMovies(pagination, {
      userId: req?.user?.id,
    });
    ResponseHandler.buildResponseSuccess(res, RESPONSE_TYPE.OK, {
      payload,
    });
  } catch (error) {
    ResponseHandler.buildResponseFailed(res, error);
  }
};

UserController.addFavorite = async (req, res) => {
  try {
    const { movieId } = req.body;
    const user = await UserService.User.findById(req?.user?.id);
    if (!user) {
      return ResponseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.BAD_REQUEST,
        message: "Không tìm thấy người dùng",
      });
    }
    if (user.favorites.includes(movieId))
      return ResponseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.BAD_REQUEST,
        message: "Bạn đã yêu thích phim này rồi",
      });

    const movie = await MovieService.findOneByIdMovie(movieId);

    if (!movie) {
      return ResponseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.BAD_REQUEST,
        message: "Phim không tồn tại",
      });
    }
    const payload = await UserService.addFavorite(user, movie.id);
    ResponseHandler.buildResponseSuccess(res, RESPONSE_TYPE.OK, {
      payload: payload,
    });
  } catch (error) {
    ResponseHandler.buildResponseFailed(res, error);
  }
};

UserController.deleteMovieFromFavorites = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const user = await UserService.User.findById(req?.user?.id);
    if (!user) {
      return ResponseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.BAD_REQUEST,
        message: "Không tìm thấy người dùng",
      });
    }
    if (!user.favorites.includes(id))
      return ResponseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.BAD_REQUEST,
        message: "Bạn chưa yêu thích phim này",
      });

    const payload = await UserService.removeMovieFromFavorites(user, id);
    ResponseHandler.buildResponseSuccess(res, RESPONSE_TYPE.OK, {
      payload: payload,
    });
  } catch (error) {
    ResponseHandler.buildResponseFailed(res, error);
  }
};

export default UserController;
