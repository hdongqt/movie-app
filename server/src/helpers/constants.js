export const Constants = {
  CRAWL: {
    BASE_URL: process.env.CRAWL_URL,
    MOVIE_LIST: process.env.CRAWL_URL + "phim-le",
    TV_SERIES_LIST: process.env.CRAWL_URL + "phim-bo",
  },
  RESPONSE_TYPE: {
    BAD_REQUEST: "bad request",
    OK: "ok",
    NOT_FOUND: "not found",
    UNAUTHORIZED: "unauthorized",
    CREATED: "created",
    FORBIDDEN: "forbidden",
    INTERNAL_SERVER_ERROR: "internal server error",
  },
  ROLE: {
    ADMIN: "admin",
    USER: "user",
  },
  STATUS: {
    ACTIVE: "active",
    INACTIVE: "inactive",
    REVIEWING: "reviewing",
    TERMINATED: "terminated",
    ALL: "all",
  },
  MOVIE_TYPE: {
    SINGLE: "single",
    TV: "tv",
    ALL: "all",
  },
};
