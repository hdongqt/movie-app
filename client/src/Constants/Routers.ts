const USER_ROUTER_ROOT = '/';
const ADMIN_ROUTER_ROOT = '/admin';

const USER_ROUTERS = {
    FORBIDDEN: '/forbidden',
    NOT_FOUND: '*',
    AUTH: '/auth',
    HOME: USER_ROUTER_ROOT,
    FILM: '/film',
    FILM_DETAIL: '/film/:id',
    SEARCH: '/search',
    GENRES: '/genres',
    FAVORITES: '/favorites'
};

const ADMIN_ROUTERS = {
    ADMIN_DASHBOARD: ADMIN_ROUTER_ROOT,
    CRAWL_MANAGEMENT: `${ADMIN_ROUTER_ROOT}/crawls`,
    CRAWL_DETAIL: `${ADMIN_ROUTER_ROOT}/crawls/detail`,
    MOVIES_MANAGEMENT: `${ADMIN_ROUTER_ROOT}/movies`,
    CREATE_MOVIE: `${ADMIN_ROUTER_ROOT}/movies/create`,
    UPDATE_MOVIE: `${ADMIN_ROUTER_ROOT}/movies/update`,
    GENRES_MANAGEMENT: `${ADMIN_ROUTER_ROOT}/genres`,
    CREATE_GENRE: `${ADMIN_ROUTER_ROOT}/genres/create`,
    UPDATE_GENRE: `${ADMIN_ROUTER_ROOT}/genres/update`,
    USERS_MANAGEMENT: `${ADMIN_ROUTER_ROOT}/users`,
    USER_DETAIL: `${ADMIN_ROUTER_ROOT}/users/detail`
};

export { USER_ROUTERS, ADMIN_ROUTERS };

export default {
    ...USER_ROUTERS,
    ...ADMIN_ROUTERS
};
