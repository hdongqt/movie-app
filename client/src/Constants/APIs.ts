export default {
    MOVIE: {
        ROOT: 'movies',
        FOR_ADMIN: 'movies/get-for-admin',
        TRENDING_MOVIE: 'movies/trending',
        RECOMMEND: 'movies/recommend',
        SIMILAR: 'movies/similar',
        MOVIE_PERSON: 'movies/person',
        ACTIVATE_MOVIE: 'movies/activate',
        DEACTIVATE_MOVIE: 'movies/deactivate',
        TERMINATED_MOVIE: 'movies/terminated'
    },
    GENRE: {
        ROOT: 'genres',
        ACTIVATE_GENRE: 'genres/activate',
        DEACTIVATE_GENRE: 'genres/deactivate'
    },
    COUNTRY: {
        ROOT: 'countries'
    },
    PERSON: {
        ROOT: 'persons'
    },
    USER: {
        ROOT: 'users',
        ACTIVATE_USER: 'users/activate',
        DEACTIVATE_USER: 'users/deactivate',
        FAVORITES: 'users/favorites'
    },
    CRAWL: {
        ROOT: 'crawls'
    },
    COMMENT: {
        ROOT: 'comments',
        TERMINATED_COMMENT: 'comments/terminated'
    },
    AUTH: {
        SIGN_UP: 'auth/signup',
        SIGN_IN: 'auth/signin',
        GET_INFO: 'auth/info',
        LOG_OUT: 'auth/logout',
        REFRESH_TOKEN: 'auth/refreshtoken'
    }
};
