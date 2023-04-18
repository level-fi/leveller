import { isAddress } from 'ethers';
import { FC, FormEvent, useCallback, useLayoutEffect, useRef, KeyboardEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const SearchInput: FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { address } = useParams();

  useLayoutEffect(() => {
    if (address) {
      inputRef.current.value = address;
    } else {
      inputRef.current.value = null;
    }
  }, [address]);

  const onSubmit = useCallback(
    (ev: FormEvent<HTMLFormElement>) => {
      ev.preventDefault();

      const query = inputRef.current.value;
      if (!query) {
        inputRef.current.setCustomValidity('Please input address');
        return;
      }

      if (isAddress(query)) {
        navigate('/' + query);
      } else {
        inputRef.current.setCustomValidity('Address is invalid');
      }
    },
    [navigate],
  );

  const onKeyUp = useCallback((ev: KeyboardEvent<HTMLInputElement>) => {
    if (ev.key !== 'Enter') {
      ev.currentTarget.setCustomValidity('');
    }
  }, []);

  return (
    <form onSubmit={onSubmit} className="flex items-center">
      <input
        ref={inputRef}
        type="search"
        autoComplete="off"
        className="py-10px px-20px rd-0 b-1 b-solid text-#fff b-#3E3E3E b-r-#53FF8A bg-transparent flex-1 xl-min-w-400px"
        placeholder="Enter or paste address..."
        onKeyUp={onKeyUp}
      />
      <button
        type="submit"
        className="py-10px px-20px b-1 b-l-0 b-solid b-#53FF8A text-#53FF8A bg-#030303 font-bold hover:color-#52ff8999"
      >
        SEARCH
      </button>
    </form>
  );
};

export default SearchInput;
