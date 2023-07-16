import c from 'classnames';
import { TokenInfo } from '../config/type';
import { VALUE_DECIMALS } from '../utils/constant';
import { BigNumberValue } from './BigNumberValue';
import Tooltip from './Tooltip';

const LGOTooltip: React.FC<{
  token: TokenInfo;
  value?: bigint;
  data: {
    title: string;
    value?: bigint;
    price?: bigint;
    isActive?: boolean;
  }[];
}> = ({ token, value, data }) => {
  return (
    <Tooltip
      place="top"
      content={
        <div className="flex flex-col font-normal w-fit">
          {data.map((item, index) => (
            <div
              key={index}
              className={c({
                'mb-8px pb-8px b-b-1px b-b-dashed b-b-#8b888863': index !== data.length - 1,
              })}
            >
              <div className="text-13px">
                Value:{' '}
                <span
                  className={c({
                    'text-primary': item.isActive,
                  })}
                >
                  <BigNumberValue
                    value={item.value}
                    decimals={VALUE_DECIMALS}
                    fractionDigits={2}
                    currency="USD"
                    prefix="~"
                  />
                </span>
              </div>
              <div className="text-muted text-10px">
                {item.title}{' '}
                <span className="text-12px">
                  <BigNumberValue
                    value={item.price}
                    decimals={VALUE_DECIMALS - token.decimals}
                    fractionDigits={0}
                    currency="USD"
                  />
                </span>
              </div>
            </div>
          ))}
        </div>
      }
    >
      <div className={c('cursor-pointer b-b-1px b-b-dashed b-b-muted w-fit', value ? 'b-b-muted' : 'b-b-transparent')}>
        <BigNumberValue value={value} decimals={VALUE_DECIMALS} fractionDigits={2} currency="USD" prefix="~" />
      </div>
    </Tooltip>
  );
};

export default LGOTooltip;
