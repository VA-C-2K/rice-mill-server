const fetchPaginatedData = async ({ model, filter = {}, page = 1, perPage = 10, sort = { _id: 1 }, populate = [], select = "" }) => {
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

export const findData = ({ model, filter = {}, populate = [], page, perPage, sort = { _id: 1 }, select }) => {
  return fetchPaginatedData({
    model,
    filter,
    page,
    perPage,
    sort,
    populate: [...populate, { path: "created_by", select: "name phonenumber" }, { path: "modified_by", select: "name phonenumber" }],
    select,
  });
};

export const createData = async ({ model, data }) => {
  const newModalObj = new model(data);
  return newModalObj.save();
};

export const updateData = async ({ id, model, data }) => {
  return model.findByIdAndUpdate(id, data, { new: true });
};

export const convertSortStringToObject = (sortString) => {
  if (!sortString) return {};

  return sortString.split(',').reduce((acc, curr) => {
    const [key, order] = curr.trim().split(':');
    acc[key.trim()] = order.trim().toLowerCase() === 'asc' ? 1 : -1;
    return acc;
  }, {});
};
