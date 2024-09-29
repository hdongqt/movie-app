import _ from "lodash";
import jsonwebtoken from "jsonwebtoken";

const paginateData = async ({
  model,
  queryOptions,
  paginationOptions,
  select = "",
  populate,
  sortBy,
}) => {
  try {
    const limit = _.parseInt(paginationOptions.limit);
    const page = _.parseInt(paginationOptions.page);
    let totalCount;
    const isGetAll = limit === 0 && page === 0;
    const offset = page > 1 ? (page - 1) * limit : 0;
    let result;
    if (queryOptions && _.isArray(queryOptions) && queryOptions.length > 0) {
      let hasAddFields, hasUnset;
      let updatedQueryOp = queryOptions.map((stage) => {
        if (stage.$addFields) {
          hasAddFields = true;
          stage.$addFields = { ...stage.$addFields, id: "$_id" };
        }
        if (stage.$unset) {
          hasUnset = true;
          stage.$unset = [...stage.$unset, "_id"];
        }
        return stage;
      });
      if (sortBy)
        updatedQueryOp = [...updatedQueryOp, { $sort: { [sortBy]: -1 } }];
      if (!hasAddFields)
        updatedQueryOp = [...updatedQueryOp, { $addFields: { id: "$_id" } }];
      if (!hasUnset) updatedQueryOp = [...updatedQueryOp, { $unset: ["_id"] }];
      const aggregationResult = await model.aggregate([
        ...updatedQueryOp,
        {
          $facet: {
            data: isGetAll ? [] : [{ $skip: offset }, { $limit: limit }],
            pagination: [{ $count: "total" }],
          },
        },
      ]);
      result = _.get(aggregationResult, "[0].data", []);
      totalCount = _.get(aggregationResult, "[0].pagination[0].total", 0);
    } else {
      let query = isGetAll
        ? model.find(queryOptions).select(select)
        : model.find(queryOptions).select(select).skip(offset).limit(limit);
      if (sortBy) query.sort({ [sortBy]: -1 });
      if (populate) query.populate(populate);
      result = await query;
      totalCount = await model.countDocuments(queryOptions);
    }
    return {
      meta: {
        itemCount: result.length,
        currentPage: isGetAll ? 1 : page,
        itemsPerPage: isGetAll ? result.length : limit,
        totalPages: isGetAll ? 1 : Math.ceil(totalCount / limit),
      },
      data: result,
    };
  } catch (error) {
    throw new Error(`Error paginating: ${error.message}`);
  }
};

const convertDataForPaginate = async (query) => {
  let { page, limit } = query;
  limit = limit ? (limit > 100 ? 100 : limit) : 10;
  page = page ? page : 1;
  const searchQuery = _.omit(query, ["page", "limit"]);
  return {
    pagination: { page, limit },
    searchQuery,
  };
};

/**
 * {
 * Person object :
{  name: 'Example',
  status: 'active',
  movies: [
    { movie: new ObjectId('xxxxxx'), role: 'actor' }
  ],
  createdAt: 2024-07-04T13:50:36.852Z,
  updatedAt: 2024-07-04T13:50:36.852Z,
  id: new ObjectId('xxxxx')
}
 **/

const transformMovies = (movie) => {
  if (!movie) return null;
  return {
    ...movie.toObject(),
    persons: movie.persons.map((person) => {
      const { movies, ...personValue } = person.toObject();
      return {
        ...personValue,
        role: _.get(
          _.find(movies, (m) => m.movie.equals(movie._id)),
          "role"
        ),
      };
    }),
  };
};

const tokenDecode = (token) => {
  try {
    return jsonwebtoken.verify(token, process.env.TOKEN_SECRET);
  } catch {
    return false;
  }
};

const handleSpecialChars = (text) => {
  if (!text) return "";
  let textHandle = text.replace(/<\/?[^>]+(>|$)/g, "");
  textHandle = textHandle.replace(/&nbsp;/g, " ");
  textHandle = textHandle.replace(
    /[^\w\sÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọủữứửựỳỵỷỹ\s]/gi,
    ""
  );
  return textHandle.replace(/\s+/g, " ").trim();
};

const convertToSlug = (text) => {
  if (!text) return "";
  let result = text.toLowerCase();
  // remove vietnamese
  result = result.replace(/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/g, "a");
  result = result.replace(/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/g, "e");
  result = result.replace(/(ì|í|ị|ỉ|ĩ)/g, "i");
  result = result.replace(/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/g, "o");
  result = result.replace(/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/g, "u");
  result = result.replace(/(ỳ|ý|ỵ|ỷ|ỹ)/g, "y");
  result = result.replace(/(đ)/g, "d");

  result = result.replace(/([^0-9a-z-\s])/g, "");

  // remove space replace by -
  result = result.replace(/(\s+)/g, "-");
  // remove - double
  result = result.replace(/-+/g, "-");
  // remove - first
  result = result.replace(/^-+/g, "");
  // remove - last
  result = result.replace(/-+$/g, "");
  if (result.length > 70) result = result.slice(0, 70);
  return result;
};

const COMMON_HELPERS = {
  paginateData,
  convertDataForPaginate,
  transformMovies,
  tokenDecode,
  handleSpecialChars,
  convertToSlug,
};

export default COMMON_HELPERS;
