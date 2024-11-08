import ResponseHandler from "../handlers/response.handler.js";
import { Constants } from "../helpers/constants.js";
import _ from "lodash";
import User from "../models/user.model.js";
import Movie from "../models/movie.model.js";
import COMMON_HELPERS from "../helpers/common.js";
const UserService = {};
const { RESPONSE_TYPE } = Constants;
UserService.User = User;

UserService.findOneByEmail = async (email) => {
  let payload = email ? email.trim() : email;
  return await User.findOne({
    email: { $regex: new RegExp("^" + payload + "$", "i") },
  }).select(
    "id email role password salt displayName status createdAt updatedAt"
  );
};

UserService.findById = async (id) => {
  return await User.findOne({ _id: id, status: "active" }).select(
    "-salt -password -favorites"
  );
};

UserService.findByIdByAdmin = async (id) => {
  return await User.findOne({ _id: id }).select("-salt -password -favorites");
};

UserService.createUser = async (payload) => {
  const { email, password, displayName, role = "user" } = payload;
  const user = new User({
    email,
    displayName,
    role,
  });
  user.setPassword(password);
  const userSave = await user.save();
  const infoUser = _.omit(userSave._doc, [
    "password",
    "salt",
    "favorites",
    "_id",
  ]);
  return {
    ...infoUser,
    id: userSave.id,
  };
};

UserService.fetchAllUser = async (paginationOptions, payload) => {
  const { status = Constants.STATUS.ACTIVE, keyword, sortBy } = payload;
  const select = "";
  let queryOp = {};
  if (status) queryOp.status = status;
  if (keyword) queryOp.name = { $regex: new RegExp(keyword, "i") };
  return await COMMON_HELPERS.paginateData({
    model: User,
    queryOptions: queryOp,
    paginationOptions: paginationOptions,
    select: select,
    sortBy: sortBy,
  });
};

UserService.getUser = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    return null;
  }
  return _.omit(user.toJSON(), ["favorites"]);
};

UserService.addFavorite = async (user, movieId) => {
  user.favorites.unshift(movieId);
  const userSave = await user.save();
  return {
    ...userSave._doc,
    id: userSave.id,
  };
};

UserService.updateUser = async (user, payload) => {
  Object.assign(user, payload);
  const userSave = await user.save();
  return _.omit(
    {
      ...userSave._doc,
      id: userSave.id,
    },
    ["_id"]
  );
};

UserService.updateUserStatus = async (user, status) => {
  Object.assign(user, {
    status: status,
  });
  const userSave = await user.save();
  return _.omit(
    {
      ...userSave._doc,
      id: userSave.id,
    },
    ["_id"]
  );
};

UserService.fetchFavoriteMovies = async (paginationOptions, payload) => {
  const { userId } = payload;
  const { page, limit } = paginationOptions;
  const findAllFavorites = await User.findById(userId)
    .populate({
      path: "favorites",
      select: "_id",
      match: { status: "active" },
    })
    .exec();

  const user = await User.findById(userId)
    .populate({
      path: "favorites",
      select: "-persons -episodes -countries -genres",
      match: { status: "active" },
      options: {
        skip: (page - 1) * limit,
        limit: limit,
      },
    })
    .exec();

  if (!user) {
    throw ResponseHandler.generateError(
      RESPONSE_TYPE.NOT_FOUND,
      `Người dùng không tồn tại`
    );
  }
  const { favorites } = user;
  return {
    meta: {
      itemCount: favorites?.length,
      currentPage: page,
      itemsPerPage: limit,
      totalPages: Math.ceil((findAllFavorites?.favorites?.length || 0) / limit),
    },
    data: user?.favorites || [],
  };
};

UserService.removeMovieFromFavorites = async (userId, movieId) => {
  const user = await User.findOne({
    _id: userId,
    status: "active",
  });
  if (!user)
    throw ResponseHandler.generateError(
      RESPONSE_TYPE.NOT_FOUND,
      `Người dùng không tồn tại`
    );

  user.favorites = user.favorites.filter(
    (movie) => movie.toString() !== movieId
  );
  const userSave = await user.save();
  return {
    ...userSave._doc,
    id: userSave.id,
  };
};

export default UserService;
