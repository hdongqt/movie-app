import PersonSlice, * as PersonSliceAction from './PersonsSlice';
import * as TypePersonAction from './PersonsAction';

export const PersonActions = { ...PersonSliceAction, ...TypePersonAction };
export default PersonSlice;
