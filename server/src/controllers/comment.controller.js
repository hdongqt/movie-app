import ResponseHandler from "../handlers/response.handler.js";
import CommentService from "./../services/comment.service.js";
import { Constants } from "../helpers/constants.js";
const { RESPONSE_TYPE, STATUS, ROLE } = Constants;
import COMMON_HELPERS from "../helpers/common.js";

const CommentController = {};

CommentController.fetchAllComment = async (req, res) => {
  try {
    const { movieId } = req.params;

    const convertDataForPagination =
      await COMMON_HELPERS.convertDataForPaginate(req.query);
    const payload = await CommentService.fetchAllComment(
      { ...convertDataForPagination.pagination, limit: 5 },
      { ...convertDataForPagination.searchQuery, movieId }
    );
    ResponseHandler.buildResponseSuccess(res, RESPONSE_TYPE.OK, {
      payload: payload,
    });
  } catch (error) {
    console.log(error);
    ResponseHandler.buildResponseFailed(res, error);
  }
};

CommentController.createComment = async (req, res) => {
  try {
    const commentSave = await CommentService.createComment({
      ...req.body,
      userId: req.user._id,
    });
    ResponseHandler.buildResponseSuccess(res, RESPONSE_TYPE.CREATED, {
      payload: commentSave,
    });
  } catch (error) {
    console.log(error);
    ResponseHandler.buildResponseFailed(res, error);
  }
};

CommentController.updateComment = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const Comment = await CommentService.Comment.findById(id);
    if (!Comment) {
      return ResponseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.BAD_REQUEST,
        message: "Không tìm thấy thể loại",
      });
    }
    const checkName = await CommentService.Comment.findOne({
      name: { $regex: new RegExp("^" + name?.trim() + "$", "i") },
    });
    if (checkName && id !== checkName?._id?.toString())
      return ResponseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.BAD_REQUEST,
        message: "Tên thể loại đã tồn tại",
      });
    const payload = await CommentService.updateComment(Comment, req.body);
    ResponseHandler.buildResponseSuccess(res, RESPONSE_TYPE.OK, {
      payload: payload,
    });
  } catch (error) {
    console.log(error);
    ResponseHandler.buildResponseFailed(res, error);
  }
};

CommentController.activateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const Comment = await CommentService.findById(id);
    if (!Comment) {
      return ResponseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.NOT_FOUND,
        message: "Thể loại không tồn tại",
      });
    }
    if (Comment.role === ROLE.ADMIN) {
      return ResponseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.FORBIDDEN,
        message: "Bạn không có quyền thực hiện thao tác này",
      });
    }
    if (Comment.status === STATUS.ACTIVE) {
      return ResponseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.BAD_REQUEST,
        message: "Thể loại đã ở trạng thái hiển thị",
      });
    }
    const result = await CommentService.updateCommentStatus(
      Comment,
      STATUS.ACTIVE
    );
    ResponseHandler.buildResponseSuccess(res, RESPONSE_TYPE.OK, {
      message: "Hiển thị thể loại thành công",
      payload: result,
    });
  } catch (error) {
    console.log(error);
    ResponseHandler.buildResponseFailed(res, error);
  }
};

CommentController.deactivateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const Comment = await CommentService.findById(id);
    if (!Comment) {
      return ResponseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.NOT_FOUND,
        message: "Thể loại không tồn tại",
      });
    }
    if (Comment.status === STATUS.INACTIVE) {
      return ResponseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.BAD_REQUEST,
        message: "Thể loại đã ở trạng thái ẩn",
      });
    }
    const result = await CommentService.updateCommentStatus(
      Comment,
      STATUS.INACTIVE
    );
    ResponseHandler.buildResponseSuccess(res, RESPONSE_TYPE.OK, {
      message: "Ẩn thể loại thành công",
      payload: result,
    });
  } catch (error) {
    console.log(error);
    ResponseHandler.buildResponseFailed(res, error);
  }
};

export default CommentController;
