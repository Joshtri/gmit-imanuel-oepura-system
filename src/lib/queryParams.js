// lib/queryParams.js

export function parseQueryParams(query, options = {}) {
  const {
    searchField = "nama", // default field for search
    defaultSortBy = "id",
    defaultSortOrder = "asc",
    defaultLimit = 10,
    defaultPage = 1,
  } = options;

  const page = parseInt(query.page) || defaultPage;
  const limit = parseInt(query.limit) || defaultLimit;
  const skip = (page - 1) * limit;

  const search = query.search || "";
  const sortBy = query.sortBy || defaultSortBy;
  const sortOrder = query.sortOrder || defaultSortOrder;

  const where = search
    ? {
        [searchField]: {
          contains: search,
          mode: "insensitive",
        },
      }
    : {};

  return {
    pagination: { page, limit, skip },
    sort: { sortBy, sortOrder },
    where,
  };
}
