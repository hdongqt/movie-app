import MoviesSlice, * as MovieSliceAction from './MoviesSlice';
import * as TypeMovieSave from './MoviesAction';

export const MovieSaves = { ...MovieSliceAction, ...TypeMovieSave };
export default MoviesSlice;
