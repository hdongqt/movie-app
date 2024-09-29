import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

export const redirect = (location: string, state?: any) => {
    return history.push(location, state);
};

export default history;
