/** PAGINATION */
const PER_PAGE = 10;
const LIMIT_PAGE = 100;

const PAGINATION = (page: number, pageLimit: number) => {
  const PAGE = page ? page : 1;
  const PERPAGE = !pageLimit
    ? PER_PAGE
    : pageLimit > LIMIT_PAGE
    ? LIMIT_PAGE
    : pageLimit;
  const STARTPAGE = (PAGE - 1) * PERPAGE;
  return { STARTPAGE, PERPAGE };
};
export { PAGINATION, PER_PAGE, LIMIT_PAGE };
