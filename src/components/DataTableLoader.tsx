import React, { memo } from 'react';
import ContentLoader, { IContentLoaderProps } from 'react-content-loader';

const range = (n: number) => {
  return new Array(n).fill(1).map((_, i) => i);
};

export const DataTableLoader: React.FC<IContentLoaderProps & { rows?: number }> = memo(function DataTableLoader({
  rows = 10,
  ...props
}) {
  const viewBoxHeight = 30 * rows + 20;
  return (
    <ContentLoader viewBox={`0 0 1200 ${viewBoxHeight}`} backgroundColor="#030303" foregroundColor="#1A1818" {...props}>
      <rect x="0" y="5" rx="4" ry="4" width="500" height="20" />
      <rect x="520" y="5" rx="4" ry="4" width="500" height="20" />
      <rect x="1050" y="5" rx="4" ry="4" width="100" height="20" />
      {range(rows).map((t) => (
        <React.Fragment key={t}>
          <rect x="0" y={40 + t * 50} rx="4" ry="4" width="500" height="20" />
          <rect x="520" y={40 + t * 50} rx="4" ry="4" width="500" height="20" />
          <rect x="1050" y={40 + t * 50} rx="4" ry="4" width="100" height="20" />
        </React.Fragment>
      ))}
    </ContentLoader>
  );
});
