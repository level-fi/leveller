import { FC, useLayoutEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import { ReactComponent as IconExternalLink } from '../assets/icons/ic_explorer.svg';
import { ReactComponent as IconHeader } from '../assets/icons/ic-header.svg';
import SearchInput from './SearchInput';

const Header: FC = () => {
  const location = useLocation();
  const [isShow, setIsShow] = useState(false);
  const ref = useRef(null);

  const toggleDropdown = () => {
    setIsShow((show) => !show);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setIsShow(false);
    }
  };

  useLayoutEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  });

  return (
    <header className={`header py-15px bg-#030303`}>
      <div className="lg-mx-auto px-20px flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/">
            <img src={logo} className="lg-w-82px lg-h-22px w-60px h-16px" />
          </Link>
          <div className={`menu display-none xl-display-block relative ml-25px b-1px b-solid b-#ffffff19`}>
            <div className="float-left pb-8px pt-10px px-14px bg-#ffffff28 relative">
              <div className="absolute bottom--1px left-3px w-30px parallelogram-sm h-3px bg-#53ff8a"></div>
              <div className="icon">
                <IconHeader />
              </div>
            </div>
            <ul className="list-none inline-block px-0 pt-10px pb-8px m-0">
              <li className="float-left h-100%">
                <NavLink
                  className="decoration-none text-#fff py-0 px-15px hover:color-#53ff8a font-bold text-14px"
                  to="/top-lp"
                >
                  Liquidity Providers
                </NavLink>
              </li>
              <li className="float-left">
                <NavLink
                  className="decoration-none text-#fff py-0 px-15px hover:color-#53ff8a font-bold text-14px"
                  to="/top-lvl"
                >
                  LVL Holders
                </NavLink>
              </li>
              <li className="float-left">
                <NavLink
                  className="decoration-none text-#fff py-0 px-15px hover:color-#53ff8a font-bold text-14px"
                  to="/top-lgo"
                >
                  LGO Holders
                </NavLink>
              </li>
              <li className="float-left">
                <NavLink
                  className="decoration-none text-#fff py-0 px-15px hover:color-#53ff8a font-bold text-14px"
                  to="/top-loyalty"
                >
                  Loyalty
                </NavLink>
              </li>
              <li className="float-left">
                <NavLink
                  className="decoration-none text-#fff py-0 px-15px hover:color-#53ff8a font-bold text-14px"
                  to="/top-referrer"
                >
                  Referrers
                </NavLink>
              </li>
            </ul>
          </div>
          <div className="menu-mobile display-block xl-display-none text-13px ml-11px">
            <div className="pl-14px b-l-1px b-l-solid b-l-#515151 flex items-center">
              <div className="icon">
                <IconHeader />
              </div>
              <div ref={ref} className="dropdown relative ml-8px">
                <div
                  className="dropdown-toggle font-bold hover:color-primary hover:cursor-pointer"
                  onClick={toggleDropdown}
                >
                  Top Leveller
                </div>
                <div
                  className={`dropdown-menu rd-5px min-w-100px flex flex-col bg-#1A1818 p-10px  ${isShow && 'show'}`}
                >
                  <NavLink
                    className="triangle-sm relative pl-16px text-#fff no-underline truncate py-8px font-500  hover:color-primary"
                    to="/top-lp"
                    onClick={toggleDropdown}
                  >
                    Liquidity Providers
                  </NavLink>
                  <NavLink
                    className="triangle-sm relative pl-16px text-#fff no-underline truncate py-8px font-500  hover:color-primary"
                    to="/top-lvl"
                    onClick={toggleDropdown}
                  >
                    LVL Holders
                  </NavLink>
                  <NavLink
                    className="triangle-sm relative pl-16px text-#fff no-underline truncate py-8px font-500  hover:color-primary"
                    to="/top-lgo"
                    onClick={toggleDropdown}
                  >
                    LGO Holders
                  </NavLink>
                  <NavLink
                    className="triangle-sm relative pl-16px text-#fff no-underline truncate py-8px font-500  hover:color-primary"
                    to="/top-loyalty"
                    onClick={toggleDropdown}
                  >
                    Loyalty
                  </NavLink>
                  <NavLink
                    className="triangle-sm relative pl-16px text-#fff no-underline truncate py-10px font-500  hover:color-primary"
                    to="/top-referrer"
                    onClick={toggleDropdown}
                  >
                    Referrers
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center ml-auto">
          {location.pathname !== '/' ? (
            <div className="display-none 2xl-block">
              <SearchInput />
            </div>
          ) : null}
          <a
            className="lg-ml-32px color-#ADABAB hover:color-primary text-13px lg-text-16px font-bold flex items-center no-underline flex"
            href="https://app.level.finance"
            target="_blank"
            rel="noreferrer noopener"
          >
            Go to App
            <IconExternalLink className="ml-10px mb-2px h-12px lg-h-15px" />
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
