import { type MouseEvent, useReducer, useRef } from 'react';
import { mockState } from '@junipero/core';
import { useTimeout } from '@junipero/hooks';
import { Transition } from 'react-transition-group';

import { cartridges } from './commons';

export interface HomeProps {
  onPlay: (cartridge: number) => void;
}

export interface HomeState {
  cartridge: number;
  position: [number, number] | null;
  centered: boolean;
  started: boolean;
}

const Home = ({ onPlay }: HomeProps) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const animationDuration = 800;
  const [state, dispatch] = useReducer(mockState<HomeState>, {
    cartridge: -1,
    position: null,
    centered: false,
    started: false,
  });

  useTimeout(() => {
    dispatch({ started: true });
  }, animationDuration, [state.centered], {
    enabled: state.centered === true && state.started === false,
  });

  useTimeout(() => {
    onPlay(state.cartridge);
  }, animationDuration, [state.started, state.cartridge], {
    enabled: state.started === true,
  });

  const onSelect = (cartridge: number, e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const { x, y } = e.currentTarget.getBoundingClientRect();

    dispatch({ position: [x, y], cartridge });
  };

  const onPostSelect = () => {
    clearTimeout(timerRef.current!);
    timerRef.current = setTimeout(() => {
      dispatch({ centered: true });
    }, animationDuration);
  };

  return (
    <>
      <Transition
        in={state.cartridge === -1}
        timeout={animationDuration}
        onExited={onPostSelect}
        nodeRef={nodeRef}
      >
        { transition => (
          <div
            ref={nodeRef}
            className="home w-full"
            style={{
              transitionProperty: 'opacity, transform',
              transitionDuration: `${animationDuration}ms`,
              transitionTimingFunction: 'ease-in-out',
              opacity: 1,
              transform: 'translateY(0)',
              ...transition === 'exited' && {
                opacity: 0,
                transform: 'translateY(-100vh)',
              },
            }}
          >
            <div className="logo flex justify-center py-24">
              <img src="/images/logo.svg" alt="logo" width={100} />
            </div>

            <div className="games flex justify-center gap-10">
              { cartridges.map((c, index) => (
                <a
                  key={index}
                  href="#"
                  onClick={onSelect.bind(null, index)}
                  className="group"
                >
                  <img
                    src={c.src}
                    className="group-hover:transform group-hover:-translate-y-1 transition-transform"
                    alt={c.alt}
                    width={300}
                    style={{
                      ...state.cartridge === index && {
                        opacity: 0,
                      }
                    }}
                  />
                </a>
              )) }
            </div>
          </div>
        ) }
      </Transition>
      { state.cartridge !== -1 && state.position && (
        <img
          src={cartridges[state.cartridge].src}
          alt={cartridges[state.cartridge].alt}
          width={300}
          className="transform -translate-y-1"
          style={{
            position: 'fixed',
            top: state.position[1],
            left: state.position[0],
            ...state.centered && {
              transitionProperty: 'top, left, transform',
              transitionDuration: `${animationDuration}ms`,
              transitionTimingFunction: 'ease-in-out',
              left: '50%',
              transform: 'translateX(-50%)',
            },
            ...state.started && {
              top: '100vh',
            },
          }}
        />
      ) }
    </>
  );
};

export default Home;
