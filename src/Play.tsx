import { useReducer } from 'react';
import { mockState, classNames } from '@junipero/core';
import { useTimeout } from '@junipero/hooks';

import { cartridges } from './commons';

export interface PlayProps {
  cartridge: number;
}

export interface PlayState {
  status: number;
}

const STATUS = {
  INIT: 0,
  INSERT: 1,
  PLAY: 2,
};

const Play = ({ cartridge }: PlayProps) => {
  const animationDuration = 1000;
  const [state, dispatch] = useReducer(mockState<PlayState>, {
    status: STATUS.INIT,
  });

  useTimeout(() => {
    dispatch({ status: STATUS.INSERT });
  }, animationDuration / 2, [state.status], {
    enabled: state.status === STATUS.INIT,
  });

  useTimeout(() => {
    dispatch({ status: STATUS.PLAY });
  }, animationDuration + 500, [state.status], {
    enabled: state.status === STATUS.INSERT,
  });

  return (
    <div className="play w-screen h-screen">
      { state.status !== STATUS.PLAY && (
        <img
          src={cartridge === 0 ? '/images/cartridge-back-silver.svg' : '/images/cartridge-back.svg'}
          className={classNames(
            'fixed z-10 left-1/2 -top-[350px] transform -translate-x-1/2 -translate-y-1/2 w-[600px]',
            {
              '!top-[calc(100vh+350px)]': state.status === STATUS.INSERT,
            }
          )}
          style={{
            transitionProperty: 'top',
            transitionDuration: `${animationDuration}ms`,
            transitionTimingFunction: 'ease-in-out',
          }}
        />
      ) }
      <div
        className={classNames(
          'gameboy fixed left-1/2 top-[calc(100vh+270px+166px)] transform',
          '-translate-x-1/2 -translate-y-1/2 z-20',
          {
            '!top-1/2': state.status === STATUS.PLAY,
          }
        )}
        style={{
          transitionProperty: 'top',
          transitionDuration: `${animationDuration}ms`,
          transitionTimingFunction: 'ease-in-out',
        }}
      >
        <img
          src="/images/gb.svg"
          className="absolute !max-w-none -top-[166px] -left-[232px] z-10 select-none pointer-events-none"
          style={{
            width: 1062,
          }}
        />
        <div
          className="screen z-20 relative w-[600px]"
          style={{
            aspectRatio: '10/9',
          }}
        >
          { state.status === STATUS.PLAY && (
            <iframe
              src={cartridges[cartridge].game}
              className="w-full h-full absolute rounded-xl"
            />
          ) }
        </div>
      </div>
    </div>
  );
};

export default Play;
