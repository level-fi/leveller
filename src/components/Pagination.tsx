import { FC } from 'react';
import { usePagination } from '../hooks/usePagination';
import { ReactComponent as IconDoubleArrowRight } from '../assets/icons/ic-double-arrow-right.svg';
import { ReactComponent as IconDoubleArrowLeft } from '../assets/icons/ic-double-arrow-left.svg';
import { ROWS_PER_PAGE } from '../utils/constant';

interface PaginationProps {
  onPageChange: (page: number) => void;
  totalCount: number;
  page: number;
  showPages?: number;
}

const Pagination: FC<PaginationProps> = ({ onPageChange, totalCount, page, showPages = 3 }) => {
  const totalPages = Math.ceil(totalCount / ROWS_PER_PAGE);
  const pages = usePagination({
    totalPages,
    page,
    showPages,
  });

  const nextPage = () => {
    onPageChange(page + 1);
  };

  const prevPage = () => {
    onPageChange(page - 1);
  };

  if (totalPages === 0) {
    return null;
  }

  return (
    <ul className="list-none p-0 flex items-center text-14px ml-auto my-5px">
      <li className="mr-8px">
        <button
          type="button"
          disabled={page == 0}
          onClick={prevPage}
          className="btn-pagination b-solid b-1px b-#ADABAB bg-transparent  rd-3px color-#ADABAB h-22px w-22px flex items-center justify-center p-0"
        >
          <IconDoubleArrowLeft width={10} height={10}/>
        </button>
      </li>
      {pages?.map((t, i) => {
        return (
          <li
            className={`cursor-pointer text-center py-2px px-6px rd-3px hover:color-primary bg-#030303 ${
              t == page ? 'color-primary b-#53FF8A b-1 b-solid' : 'color-#ADABAB b-#030303 b-1 b-solid'
            } ${i > 0 ? 'ml-7px' : ''}`}
            key={t}
            onClick={() => onPageChange(t)}
          >
            {t + 1}
          </li>
        );
      })}
      <li className="ml-8px">
        <button
          type="button"
          disabled={page >= totalPages - 1}
          onClick={nextPage}
          className="btn-pagination b-solid b-1px b-#ADABAB bg-transparent rd-3px color-#ADABAB h-22px w-22px flex items-center justify-center p-0"
        >
          <IconDoubleArrowRight width={10} height={10}/>
        </button>
      </li>
    </ul>
  );
};

export default Pagination;
