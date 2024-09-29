export interface ICommentPaginationFilter {
    movieId: string;
    limit: number;
    page: number;
    sortBy?: string;
    orderBy?: string;
}

export interface ICommentPayload {
    parentId?: string;
    movieId: string;
    content: string;
}
