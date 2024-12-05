import ResponseHandler from "../handlers/response.handler.js";
import CommentService from "./../services/comment.service.js";
import { Constants } from "../helpers/constants.js";
const { RESPONSE_TYPE, STATUS, ROLE } = Constants;
import COMMON_HELPERS from "../helpers/common.js";
import TransactionService from "../services/transaction.service.js";

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
    ResponseHandler.buildResponseFailed(res, error);
  }
};

CommentController.terminatedComment = async (req, res) => {
  try {
    await TransactionService.start(async () => {
      const { id } = req.params;
      const commentFind = await CommentService.findById(id);
      if (!commentFind) {
        return ResponseHandler.buildResponseFailed(res, {
          type: RESPONSE_TYPE.NOT_FOUND,
          message: "Bình luận không tồn tại",
        });
      }
      if (
        (commentFind?.user && commentFind.user.equals(req.user.id)) ||
        req.user.role === ROLE.ADMIN
      ) {
        const result = await CommentService.terminatedComment(commentFind);
        ResponseHandler.buildResponseSuccess(res, RESPONSE_TYPE.OK, {
          message: "Xoá comment thành công",
          payload: result,
        });
      } else
        return ResponseHandler.buildResponseFailed(res, {
          type: RESPONSE_TYPE.FORBIDDEN,
          message: "Không có quyền xoá bình luận này",
        });
    });
  } catch (error) {
    ResponseHandler.buildResponseFailed(res, error);
  }
};

export default CommentController;
