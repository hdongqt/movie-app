import ResponseHandler from "../handlers/response.handler.js";
import { Constants } from "../helpers/constants.js";
import MovieCrawlService from "../services/crawl/movie.crawl.service.js";
import CrawlService from "../services/crawl.service.js";
import COMMON_HELPERS from "../helpers/common.js";
import axios from "axios";

const { RESPONSE_TYPE } = Constants;
const CrawlController = {};

const handleCrawl = async (page) => {
  let crawlItem;
  try {
    crawlItem = await CrawlService.createCrawl();
    if (crawlItem) {
      const movies = await axios.get(
        `${process.env.OPHIM_LINK}/danh-sach/phim-moi-cap-nhat?page=${page}`
      );
      const data = movies.data.items;
      const getAllDetail =
        data?.length > 0 &&
        data.map(
          async (movie) => await MovieCrawlService.getDetailMovie(movie.slug)
        );

      const result = await MovieCrawlService.createMovies(
        await Promise.all(getAllDetail)
      );
      const movieIds = result.map((item) => item.id);
      await CrawlService.updateCrawl({
        id: crawlItem._id,
        status: "complete",
        info: `Lấy thành công ${result?.length} bộ phim`,
        finishedAt: Date.now(),
        movieIds: movieIds,
      });
      return result;
    }
  } catch (error) {
    if (crawlItem) {
      await CrawlService.updateCrawl({
        id: crawlItem._id,
        status: "error",
        finishedAt: Date.now(),
        info: "Lỗi từ server",
      });
    }
  }
};

CrawlController.createCrawl = async (req, res) => {
  try {
    const { page } = req.body;
    const isAllowCrawl = await CrawlService.checkCrawling();
    if (!isAllowCrawl) {
      throw ResponseHandler.generateError(
        RESPONSE_TYPE.BAD_REQUEST,
        "Đã có hoạt động crawl đang chạy"
      );
    } else {
      ResponseHandler.buildResponseSuccess(res, Constants.RESPONSE_TYPE.OK, {
        message: "Tạo crawl thành công",
      });
      await handleCrawl(page);
    }
  } catch (error) {
    ResponseHandler.buildResponseFailed(res, error);
  }
};

CrawlController.fetchAllCrawls = async (req, res) => {
  try {
    const convertDataForPagination =
      await COMMON_HELPERS.convertDataForPaginate(req.query);
    const payload = await CrawlService.fetchAllCrawl(
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

CrawlController.getCrawl = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = await CrawlService.getCrawl(id);
    if (!payload) {
      return ResponseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.NOT_FOUND,
        message: "Không tìm thấy hoạt động crawl",
      });
    }
    ResponseHandler.buildResponseSuccess(res, RESPONSE_TYPE.OK, {
      payload: payload,
    });
  } catch (error) {
    ResponseHandler.buildResponseFailed(res, error);
  }
};

export default CrawlController;
