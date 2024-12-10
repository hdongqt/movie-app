import _ from "lodash";
import Person from "../models/person.model.js";
import mongoose from "mongoose";
import TransactionService from "./transaction.service.js";
const PersonService = {};

PersonService.getPerson = async (idMovie) => {
  return await Person.findOne({ _id: idMovie }).select("-movies");
};

PersonService.createPersons = async (movieId, persons) => {
  const session = TransactionService.getSession();
  if (persons && persons.length > 0) {
    const result = await persons.map(async (person) => {
      const personFind = await Person.findOne({
        name: person.name,
      });
      if (personFind) {
        personFind.movies.push({
          movie: movieId,
          nameCharacter: person.nameCharacter,
          role: person.role,
        });
        await personFind.save({ session });
        return personFind._id;
      } else {
        const [personCreated] = await Person.create(
          [
            {
              name: person.name,
              movies: [
                {
                  movie: movieId,
                  nameCharacter: person.nameCharacter,
                  role: person.role,
                },
              ],
            },
          ],
          { session }
        );
        return personCreated._id;
      }
    });
    return await Promise.all(result);
  } else return [];
};

PersonService.deleteByIds = async (movieId) => {
  const session = TransactionService.getSession();
  return await Person.updateMany(
    {
      "movies.movie": mongoose.Types.ObjectId.createFromHexString(movieId),
    }, // find persons has movieId
    {
      $pull: {
        movies: { movie: mongoose.Types.ObjectId.createFromHexString(movieId) },
      },
    }, //remove movieId
    { session }
  );
};

export default PersonService;
