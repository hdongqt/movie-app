import APIClient from '../Client/APIClient';
import { API } from '@/Constants';
const { PERSON } = API;

const getPerson = async (id: string) => {
    return APIClient.get(`${PERSON.ROOT}/${id}`);
};
export default { getPerson };
