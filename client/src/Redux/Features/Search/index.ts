import SearchSlice, * as SearchSliceAction from './SearchSlice';
import * as TypeSearchAction from './SearchAction';

export const SearchActions = { ...SearchSliceAction, ...TypeSearchAction };
export default SearchSlice;
