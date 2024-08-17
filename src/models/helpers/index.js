export const fetchPaginatedData = async ({ model, filter = {}, page = 1, perPage = 10, sort = { _id: 1 }, populate = [], select = "" }) => {
  const totalCount = await model.countDocuments(filter);
  const data = await model
    .find(filter)
    .sort(sort)
    .skip((page - 1) * perPage)
    .limit(perPage)
    .select(select)
    .populate(populate);

  return {
    data,
    paging: {
      total: totalCount,
      current_page: page,
      total_pages: Math.ceil(totalCount / perPage),
    },
  };
};
