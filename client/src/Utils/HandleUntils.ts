import _ from 'lodash';
import 'dayjs/locale/vi';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';

dayjs.locale('vi');
dayjs.extend(relativeTime);

const getLastChar = (name: string) => {
    const trimmedStr = _.trim(name);
    if (!trimmedStr) return 'N/A';
    const lastSpaceIndex = _.lastIndexOf(trimmedStr, ' ');
    if (lastSpaceIndex !== -1) return trimmedStr[lastSpaceIndex + 1];
    return trimmedStr[0];
};

const formatDateAgo = (date: Date | string) => {
    const now = dayjs();
    const diff = dayjs(date);
    if (!diff.isValid()) return 'N/A';
    if (now.diff(diff, 'hour') < 24) {
        return diff.fromNow();
    } else {
        return diff.format('DD/MM/YYYY');
    }
};
const formatDateTime = (date: Date | string) => {
    return dayjs(date).format('DD-MM-YYYY, HH:mm');
};

export default { getLastChar, formatDateAgo, formatDateTime };
