/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ComponentProps, FC } from 'react';

/**
 * Combines components together, from the given array.
 * Usually is used to "flatten" highly nested structures, such as
 * multiple context providers.
 *
 * @param components multiple components that will be nested together
 */
export const combineComponents = (...components: Array<FC<any>>): FC => {
  return components.reduce(
    (AccumulatedComponents, CurrentComponent) => {
      return ({ children }: ComponentProps<FC<any>>): JSX.Element => {
        return (
          <AccumulatedComponents>
            <CurrentComponent>{children}</CurrentComponent>
          </AccumulatedComponents>
        );
      };
    },
    // eslint-disable-next-line react/jsx-no-useless-fragment
    ({ children }) => <>{children}</>
  );
};
