import responseHandler from "../handlers/response.handler.js";
import UserService from "./../services/user.service.js";
import { Constants } from "../helpers/constants.js";
const { RESPONSE_TYPE, STATUS } = Constants;
import COMMON_HELPERS from "../helpers/common.js";
import MovieService from "./../services/movie.service.js";

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

UserController.updateProfile = async (req, res) => {
  try {
    const { displayName } = req.body;
    const user = await UserService.User.findById(req?.user?.id);
    if (!user) {
      return responseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.BAD_REQUEST,
        message: "Không tìm thấy người dùng",
      });
    }
    const payload = await UserService.updateUser(user, { displayName });
    responseHandler.buildResponseSuccess(res, RESPONSE_TYPE.OK, {
      payload: payload,
    });
  } catch (error) {
    console.log(error);
    responseHandler.buildResponseFailed(res, error);
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
    responseHandler.buildResponseSuccess(res, RESPONSE_TYPE.OK, {
      payload,
    });
  } catch (error) {
    console.log(error);
    responseHandler.buildResponseFailed(res, error);
  }
};

UserController.addFavorite = async (req, res) => {
  try {
    const { movieId } = req.body;
    const user = await UserService.User.findById(req?.user?.id);
    if (!user) {
      return responseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.BAD_REQUEST,
        message: "Không tìm thấy người dùng",
      });
    }
    if (user.favorites.includes(movieId))
      return responseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.BAD_REQUEST,
        message: "Bạn đã yêu thích phim này rồi",
      });

    const movie = await MovieService.findOneByIdMovie(movieId);

    if (!movie) {
      return responseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.BAD_REQUEST,
        message: "Phim không tồn tại",
      });
    }
    const payload = await UserService.addFavorite(user, movie.id);
    responseHandler.buildResponseSuccess(res, RESPONSE_TYPE.OK, {
      payload: payload,
    });
  } catch (error) {
    console.log(error);
    responseHandler.buildResponseFailed(res, error);
  }
};

UserController.deleteMovieFromFavorites = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const user = await UserService.User.findById(req?.user?.id);
    if (!user) {
      return responseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.BAD_REQUEST,
        message: "Không tìm thấy người dùng",
      });
    }
    if (!user.favorites.includes(id))
      return responseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.BAD_REQUEST,
        message: "Bạn chưa yêu thích phim này",
      });

    const payload = await UserService.removeMovieFromFavorites(user, id);
    responseHandler.buildResponseSuccess(res, RESPONSE_TYPE.OK, {
      payload: payload,
    });
  } catch (error) {
    console.log(error);
    responseHandler.buildResponseFailed(res, error);
  }
};

export default UserController;
