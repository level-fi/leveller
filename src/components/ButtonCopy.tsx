import { useCallback, useRef, useState } from 'react';
import { ReactComponent as IconCopy } from '../assets/icons/ic-copy.svg';
import { copyTextToClipboard } from '../utils/clipboard';
import Tooltip from './Tooltip';

const ButtonCopy: React.FC<{ text: string; children?: React.ReactNode }> = ({ text, children }) => {
  const onClick = useCallback(() => {
    copyTextToClipboard(text);
  }, [text]);

  return (
    <Tooltip
      event="click"
      content={<span className="text-12px">Copied to clipboard</span>}
      clickOptions={{ timeout: 2000, autoHide: true }}
    >
      <div className="flex items-center ">
        <button
          type="button"
          className="b-none bg-transparent p-5x flex items-center text-13px color-primary hover:color-#52ff8999"
          onClick={onClick}
        >
          <IconCopy height="16px" />
          {children}
        </button>
      </div>
    </Tooltip>
  );
};

export default ButtonCopy;
