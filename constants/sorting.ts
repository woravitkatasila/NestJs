const SORT = {
  ASC: `ASC`,
  DESC: `DESC`,
};

const SORT_BY_FIELD = {
  createdAt: `createdAt`,
  updatedAt: `updatedAt`,
};

/** SORTING */
const ORDERBY = (SORT_SET, SORT_BY: string, SORTING: string) => {
  if (!SORT_SET[SORT_BY]) SORT_BY = SORT_BY_FIELD.createdAt;
  else SORT_BY = SORT_SET[SORT_BY];

  if (!SORT[SORTING]) SORTING = SORT.DESC;
  else SORTING = SORT[SORTING];
  return { SORT_BY, SORT: SORTING };
};

export { ORDERBY, SORT, SORT_BY_FIELD };
