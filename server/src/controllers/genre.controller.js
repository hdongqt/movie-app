import ResponseHandler from "../handlers/response.handler.js";
import GenreService from "./../services/genre.service.js";
import { Constants } from "../helpers/constants.js";
const { RESPONSE_TYPE, STATUS, ROLE } = Constants;
import COMMON_HELPERS from "../helpers/common.js";

const GenreController = {};

GenreController.fetchAllGenre = async (req, res) => {
  try {
    const { status = STATUS.ALL } = req.query;

    const convertDataForPagination =
      await COMMON_HELPERS.convertDataForPaginate(req.query);
    const payload = await GenreService.fetchAllGenre(
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

GenreController.getGenre = async (req, res) => {
  try {
    const role = "admin";
    const { id } = req.params;
    const payload = await GenreService.getGenre(id);
    if (!payload || (role !== "admin" && payload?.status !== STATUS.ACTIVE)) {
      return ResponseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.NOT_FOUND,
        message: "Không tìm thấy thể loại",
      });
    }
    ResponseHandler.buildResponseSuccess(res, RESPONSE_TYPE.OK, {
      payload: payload,
    });
  } catch (error) {
    ResponseHandler.buildResponseFailed(res, error);
  }
};

GenreController.createGenre = async (req, res) => {
  try {
    const { name } = req.body;
    const existGenre = await GenreService.Genre.find({
      name: { $regex: name.trim().toLowerCase(), $options: "i" },
    });
    if (existGenre && existGenre.length > 0)
      return ResponseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.BAD_REQUEST,
        message: "Thể loại đã tồn tại",
      });
    const genre = await GenreService.createGenre(req.body);
    ResponseHandler.buildResponseSuccess(res, RESPONSE_TYPE.CREATED, {
      payload: genre,
    });
  } catch (error) {
    console.log(error);
    ResponseHandler.buildResponseFailed(res, error);
  }
};

GenreController.updateGenre = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const genre = await GenreService.Genre.findById(id);
    if (!genre) {
      return ResponseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.BAD_REQUEST,
        message: "Không tìm thấy thể loại",
      });
    }
    const checkName = await GenreService.Genre.findOne({
      name: { $regex: new RegExp("^" + name?.trim() + "$", "i") },
    });
    if (checkName && id !== checkName?._id?.toString())
      return ResponseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.BAD_REQUEST,
        message: "Tên thể loại đã tồn tại",
      });
    const payload = await GenreService.updateGenre(genre, req.body);
    ResponseHandler.buildResponseSuccess(res, RESPONSE_TYPE.OK, {
      payload: payload,
    });
  } catch (error) {
    console.log(error);
    ResponseHandler.buildResponseFailed(res, error);
  }
};

GenreController.activateGenre = async (req, res) => {
  try {
    const { id } = req.params;
    const genre = await GenreService.findById(id);
    if (!genre) {
      return ResponseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.NOT_FOUND,
        message: "Thể loại không tồn tại",
      });
    }
    if (genre.role === ROLE.ADMIN) {
      return ResponseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.FORBIDDEN,
        message: "Bạn không có quyền thực hiện thao tác này",
      });
    }
    if (genre.status === STATUS.ACTIVE) {
      return ResponseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.BAD_REQUEST,
        message: "Thể loại đã ở trạng thái hiển thị",
      });
    }
    const result = await GenreService.updateGenreStatus(genre, STATUS.ACTIVE);
    ResponseHandler.buildResponseSuccess(res, RESPONSE_TYPE.OK, {
      message: "Hiển thị thể loại thành công",
      payload: result,
    });
  } catch (error) {
    console.log(error);
    ResponseHandler.buildResponseFailed(res, error);
  }
};

GenreController.deactivateGenre = async (req, res) => {
  try {
    const { id } = req.params;
    const genre = await GenreService.findById(id);
    if (!genre) {
      return ResponseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.NOT_FOUND,
        message: "Thể loại không tồn tại",
      });
    }
    if (genre.status === STATUS.INACTIVE) {
      return ResponseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.BAD_REQUEST,
        message: "Thể loại đã ở trạng thái ẩn",
      });
    }
    const result = await GenreService.updateGenreStatus(genre, STATUS.INACTIVE);
    ResponseHandler.buildResponseSuccess(res, RESPONSE_TYPE.OK, {
      message: "Ẩn thể loại thành công",
      payload: result,
    });
  } catch (error) {
    console.log(error);
    ResponseHandler.buildResponseFailed(res, error);
  }
};

export default GenreController;
