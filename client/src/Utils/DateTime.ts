import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';

dayjs.locale('vi');
dayjs.extend(relativeTime);

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
export default { formatDateAgo, formatDateTime };
