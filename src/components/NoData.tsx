import { ReactNode } from 'react';

export const NoData: React.FC<{ children: ReactNode; absolute?: boolean }> = ({ children, absolute }) => {
  return (
    <div
      className={`${
        absolute ? 'absolute top-0 bottom-0 left-0 right-0' : 'min-h-60px'
      } flex items-center justify-center color-#ADABAB text-13px lg-text-14px`}
    >
      {children}
    </div>
  );
};
