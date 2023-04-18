import { FC, useCallback, useRef, MouseEvent, useState, KeyboardEvent, FormEvent } from 'react';
import search from '../assets/images/img-search.png';
import { NavLink, useNavigate } from 'react-router-dom';
import { isAddress } from 'ethers';

const Search: FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [message, setMessage] = useState(null);

  const onSubmit = useCallback(
    (ev: FormEvent<HTMLFormElement>) => {
      ev.preventDefault();
      const query = inputRef.current.value;
      if (!query) {
        setMessage('Please input address');
        return;
      }

      if (isAddress(query)) {
        navigate(query);
      } else {
        setMessage('Address is invalid');
      }
    },
    [navigate],
  );

  const onKeyUp = useCallback((ev: KeyboardEvent<HTMLInputElement>) => {
    if (ev.key !== 'Enter') {
      setMessage(null);
    }
  }, []);

  return (
    <div className="search">
      <div className="container search-inner relative mx-auto flex flex-col lg-items-center pt-100px">
        <img src={search} className="mx-auto" />
        <span className="title text-18px lg-text-24px font-bold mt-32px text-center">Leveller</span>
        <span className="mt-20px mx-20px text-center text-13px lg-text-14px lg-text-1rem leading-5">
          Instant tracking of key statistics of any Leveller.
        </span>
        <form
          onSubmit={onSubmit}
          className="search-input flex mx-auto justify-center mt-32px px-10px lg-px-0 lg-w-55% xl-w-50% 2xl-w-40%"
        >
          <input
            ref={inputRef}
            type="search"
            autoComplete="off"
            className="py-10px px-20px rd-0 b-1 b-solid text-#fff b-#53FF8A bg-transparent flex-1 text-13px lg-text-14px"
            placeholder="Enter Address"
            onKeyUp={onKeyUp}
          />
          <button
            type="submit"
            className="text-13px lg-text-14px  py-10px px-20px b-1 b-l-0 b-solid b-#53FF8A text-#53FF8A bg-#030303 font-bold hover:color-#52ff8999"
          >
            SEARCH
          </button>
        </form>

        <div className="mt-10px text-#f6475d text-13px lg-text-14px text-center">{message}</div>
        <div className="quick-links flex justify-around mx-auto gap-x-10px mt-36px px-10px lg-px-0 justify-items-center lg-w-55% xl-w-50% 2xl-w-40%">
          <div className="flex flex-col">
            <NavLink
              className="lg-text-14px text-13px triangle relative color-#fff no-underline hover:color-primary pl-20px"
              to="/top-lp"
            >
              Top Liquidity Providers
            </NavLink>
            <NavLink
              className="lg-text-14px text-13px mt-20px triangle relative color-#fff no-underline hover:color-primary pl-20px"
              to="/top-lvl"
            >
              Top LVL Holders
            </NavLink>
            <NavLink
              className="lg-text-14px text-13px mt-20px triangle relative color-#fff no-underline hover:color-primary pl-20px"
              to="/top-loyalty"
            >
              Top Loyalty
            </NavLink>
          </div>
          <div className="flex flex-col">
            <NavLink
              className="lg-text-14px text-13px triangle relative color-#fff no-underline hover:color-primary pl-20px"
              to="/top-lgo"
            >
              Top LGO Holders
            </NavLink>
            <NavLink
              className="lg-text-14px text-13px mt-20px triangle relative color-#fff no-underline hover:color-primary pl-20px"
              to="/top-referrer"
            >
              Top Referrers
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
