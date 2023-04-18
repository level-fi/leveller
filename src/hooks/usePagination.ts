import { useMemo } from 'react';

const range = (start, end) => {
  let length = end - start;
  return Array.from({ length }, (_, idx) => idx + start);
};

export const usePagination = ({ totalPages, page, showPages }) => {
  const pages = useMemo(() => {
    let diff = Math.floor(showPages / 2),
      start = Math.max(page - diff, 0),
      end = Math.min(start + showPages, totalPages);
    if (totalPages >= showPages && end >= totalPages) {
      start = totalPages - showPages;
    }
    return range(start, end);
  }, [totalPages, page, showPages]);

  return pages;
};
