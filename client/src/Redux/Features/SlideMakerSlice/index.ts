import SlideMakerSlice, * as SlideMakerSliceAction from './SlideMakerSlice';
import * as TypeSlideMakerAction from './SlideMakerAction';

export const SlideMakerActions = {
    ...SlideMakerSliceAction,
    ...TypeSlideMakerAction
};
export default SlideMakerSlice;
