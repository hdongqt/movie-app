import Comment from "../models/comment.model.js";
import { Constants } from "../helpers/constants.js";
import _ from "lodash";
const { RESPONSE_TYPE } = Constants;
import COMMON_HELPERS from "../helpers/common.js";
import TransactionService from "./transaction.service.js";

const CommentService = {};

CommentService.Comment = Comment;

CommentService.findById = async (id) => {
  return await Comment.findById(id);
};

CommentService.fetchAllComment = async (paginationOptions, payload) => {
  const {
    status = Constants.STATUS.ACTIVE,
    keyword,
    sortBy,
    movieId,
  } = payload;
  const select = "";
  let queryOp = {
    movie: movieId,
    parent_id: null,
  };
  if (status) queryOp.status = status;
  if (keyword) queryOp.name = { $regex: new RegExp(keyword, "i") };
  return await COMMON_HELPERS.paginateData({
    model: Comment,
    queryOptions: queryOp,
    paginationOptions: paginationOptions,
    select: select,
    sortBy: sortBy,
    populate: [
      { path: "user", select: "displayName id status" },
      {
        path: "replies",
        select: "-replies",
        populate: { path: "user", select: "-salt -password -favorites" },
      },
    ],
  });
};

CommentService.getComment = async (id) => {
  const Comment = await Comment.findById(id);
  if (!Comment) {
    return null;
  }
  return Comment.toJSON();
};

CommentService.createComment = async (payload) => {
  const { parentId = null, movieId, content, userId } = payload;

  let replyCommentId;

  if (parentId) {
    const replyComment = await Comment.create({
      movie: movieId,
      user: userId,
      content,
      parent_id: parentId,
    });
    replyCommentId = replyComment._id;
    await Comment.findOneAndUpdate(
      { _id: parentId },
      { $push: { replies: replyCommentId } },
      { new: true }
    );
  } else {
    const newComment = await Comment.create({
      movie: movieId,
      user: userId,
      content,
    });
    replyCommentId = newComment._id;
  }
  const result = Comment.findById(replyCommentId).populate([
    { path: "user", select: "-salt -password -favorites" },
    {
      path: "replies",
      select: "-replies",
      populate: { path: "user", select: "-salt -password -favorites" },
    },
  ]);
  return result;
};

CommentService.updateComment = async (Comment, payload) => {
  const { name } = payload;
  Object.assign(Comment, { name });
  const CommentSave = await Comment.save();
  return {
    ...CommentSave._doc,
    id: CommentSave.id,
  };
};

CommentService.updateCommentStatus = async (Comment, status) => {
  Object.assign(Comment, {
    status: status,
  });
  const CommentSave = await Comment.save();
  return _.omit(
    {
      ...CommentSave._doc,
      id: CommentSave.id,
    },
    ["_id"]
  );
};

CommentService.createComments = async (listComments) => {
  const session = TransactionService.getSession();
  if (listComments) {
    let commentIds = [];
    for (const commentName of listComments) {
      let comment =
        (await Comment.findOne({
          name: { $regex: new RegExp("^" + commentName + "$", "i") },
        })) || (await Comment.create([{ name: commentName }], { session }))[0];
      commentIds.push(comment._id);
    }
    return commentIds;
  }
  return [];
};

CommentService.terminatedComment = async (comment) => {
  const session = TransactionService.getSession();
  if (!session) {
    throw new Error("Transaction không tồn tại");
  }
  if (comment.replies.length > 0) {
    await Comment.updateMany(
      { _id: { $in: comment.replies } },
      { $set: { status: Constants.STATUS.INACTIVE } },
      { session, runValidators: true }
    );
  }
  Object.assign(comment, {
    status: Constants.STATUS.INACTIVE,
  });
  return await comment.save({ session });
};

CommentService.getIdOfListName = async (listNames) => {
  var regexNames = listNames.map((name) => new RegExp(name, "i"));
  const data = await Comment.find({ name: { $in: regexNames } });
  if (!data) return null;
  return data.map((g) => g.id);
};

export default CommentService;
