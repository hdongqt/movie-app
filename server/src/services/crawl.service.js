import Crawl from "../models/crawl.model.js";
import _ from "lodash";
import COMMON_HELPERS from "../helpers/common.js";
const CrawlService = {};

CrawlService.Crawl = Crawl;

CrawlService.fetchAllCrawl = async (paginationOptions, params) => {
  const { status } = params;
  let queryOp = {};
  if (status) queryOp.status = status;

  const populate = {
    path: "movies",
    select: "-persons -countries -genres -episodes",
  };
  return await COMMON_HELPERS.paginateData({
    model: Crawl,
    queryOptions: queryOp,
    paginationOptions: paginationOptions,
    select: "",
    sortBy: "createdAt",
    populate: populate,
  });
};

CrawlService.createCrawl = async () => {
  return await Crawl.create({ status: "crawling" });
};

CrawlService.updateCrawl = async ({
  id,
  status,
  info,
  movieIds,
  finishedAt,
}) => {
  const a = await Crawl.findByIdAndUpdate(
    id,
    { status, finishedAt, info: info || "", movies: movieIds },
    { new: true }
  );
  return a;
};
CrawlService.checkCrawling = async () => {
  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
  const record = await Crawl.findOne({ status: "crawling" });
  if (!record) return true;
  if (record.createdAt <= fifteenMinutesAgo) {
    await CrawlService.Crawl.updateOne(
      { _id: record._id },
      {
        $set: {
          status: "error",
          info: "Quá trình crawl đã vượt quá thời gian",
        },
      }
    );
    return true;
  }
  return false;
};

CrawlService.getCrawl = async (id) => {
  return await Crawl.findOne({ _id: id });
};

export default CrawlService;
