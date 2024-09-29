import Episode from "../models/episode.model.js";
import { Constants } from "../helpers/constants.js";
import _ from "lodash";
import TransactionService from "./transaction.service.js";

const EpisodeService = {};

EpisodeService.Episode = Episode;

EpisodeService.fetchAllEpisode = async (status) => {
  if (status === Constants.STATUS.ALL) return await Episode.find();
  return await Episode.find({ status: status });
};

EpisodeService.getEpisode = async (id) => {
  const episode = await Episode.findById(id);
  if (!episode) {
    return null;
  }
  return episode.toJSON();
};

EpisodeService.createEpisode = async (payload) => {
  const { name, path } = payload;
  const episode = new Episode({
    name: name,
    path: path,
  });
  const episodeSave = await episode.save();
  return {
    ...episodeSave._doc,
    id: episodeSave.id,
  };
};

EpisodeService.updateEpisode = async (episode, payload) => {
  Object.assign(episode, { ...payload });
  const episodeSave = await episode.save();
  return {
    ...episodeSave._doc,
    id: episodeSave.id,
  };
};

EpisodeService.updateEpisodeStatus = async (episode, status) => {
  Object.assign(episode, {
    status: status,
  });
  const episodeSave = await episode.save();
  return {
    ...episodeSave._doc,
    id: episodeSave.id,
  };
};

EpisodeService.createEpisodes = async (listEpisodes) => {
  const session = TransactionService.getSession();
  if (listEpisodes) {
    let episodeIds = [];
    for (const episode of listEpisodes) {
      let result =
        (await Episode.findOne({
          name: { $regex: new RegExp("^" + episode.name + "$", "i") },
          path: episode.path,
        }).session(session)) ||
        (
          await Episode.create([{ name: episode.name, path: episode.path }], {
            session,
          })
        )[0];
      episodeIds.push(result._id);
    }
    return episodeIds;
  }
  return null;
};

EpisodeService.getIdOfListName = async (listNames) => {
  var regexNames = listNames.map((name) => new RegExp(name, "i"));
  const data = await Episode.find({ name: { $in: regexNames } });
  if (!data) return null;
  return data.map((g) => g.id);
};

EpisodeService.deleteByIds = async (ids) => {
  const session = TransactionService.getSession();
  return await Episode.deleteMany({ _id: { $in: ids } }).session(session);
};

export default EpisodeService;
