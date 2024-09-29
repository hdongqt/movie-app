import HomeSlice, * as HomeSliceAction from './HomeSlice';
import * as TypeHomeAction from './HomeAction';

export const HomeActions = { ...HomeSliceAction, ...TypeHomeAction };
export default HomeSlice;
