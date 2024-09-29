import responseHandler from "../handlers/response.handler.js";
import EpisodeService from "./../services/episode.service.js";
import { Constants } from "../helpers/constants.js";

const { RESPONSE_TYPE, STATUS } = Constants;

const EpisodeController = {};

EpisodeController.fetchAllEpisode = async (req, res) => {
  try {
    const { status = STATUS.ALL } = req.query;
    const payload = await EpisodeService.fetchAllEpisode(status);
    responseHandler.buildResponseSuccess(res, RESPONSE_TYPE.OK, {
      payload: payload,
    });
  } catch (error) {
    responseHandler.buildResponseFailed(res, error);
  }
};

EpisodeController.getEpisode = async (req, res) => {
  try {
    const role = "admin";
    const { id } = req.params;
    const payload = await EpisodeService.getEpisode(id);
    if (!payload) {
      return responseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.NOT_FOUND,
        message: "Episode not found",
      });
    }
    if (role !== "admin" && payload?.status !== STATUS.ACTIVE) {
      return responseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.NOT_FOUND,
        message: "Episode not found",
      });
    }
    responseHandler.buildResponseSuccess(res, RESPONSE_TYPE.OK, {
      payload: payload,
    });
  } catch (error) {
    responseHandler.buildResponseFailed(res, error);
  }
};

EpisodeController.createEpisode = async (req, res) => {
  try {
    const { name, path } = req.body;
    const existEpisode = await EpisodeService.Episode.find({
      name: { $regex: name.toLowerCase(), $options: "i" },
      path: path,
    });
    if (existEpisode && existEpisode.length > 0)
      return responseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.BAD_REQUEST,
        message: "Episode already existed",
      });
    const episode = await EpisodeService.createEpisode(req.body);
    responseHandler.buildResponseSuccess(res, RESPONSE_TYPE.CREATED, {
      payload: episode,
    });
  } catch (error) {
    console.log(error);
    responseHandler.buildResponseFailed(res, error);
  }
};

EpisodeController.updateEpisode = async (req, res) => {
  try {
    const { id } = req.params;
    const episode = await EpisodeService.Episode.findById(id);
    if (!episode) {
      return responseHandler.buildResponseFailed(res, {
        type: RESPONSE_TYPE.BAD_REQUEST,
        message: "Episode not found",
      });
    }
    const payload = await EpisodeService.updateEpisode(episode, req.body);
    responseHandler.buildResponseSuccess(res, RESPONSE_TYPE.OK, {
      payload: payload,
    });
  } catch (error) {
    console.log(error);
    responseHandler.buildResponseFailed(res, error);
  }
};

export default EpisodeController;
