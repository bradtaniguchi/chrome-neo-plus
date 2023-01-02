import { Button } from 'flowbite-react';
import { ReactNode, SyntheticEvent } from 'react';

export interface StorybookLandingProps {
  /**
   * An example prop, provided to check with docs. Shown below the example text,
   * but before the button.
   *
   * @type {ReactNode}
   */
  exampleProp?: ReactNode;

  /**
   * An example callback. If not provided then the example button will not
   * show.
   *
   * @default void
   */
  onButtonClick?: (e: SyntheticEvent<HTMLButtonElement, MouseEvent>) => void;
}

/**
 * Storybook landing component.
 *
 * @param props display props for storybook landing component
 */
export function StorybookLanding(props: StorybookLandingProps) {
  const handleButtonClick = (
    e: SyntheticEvent<HTMLButtonElement, MouseEvent>
  ) => typeof props.onButtonClick === 'function' && props.onButtonClick(e);

  return (
    <div className="flex w-full max-w-full flex-col gap-y-1 p-2">
      <h1 className="mt-0 mb-6 text-5xl font-bold">Welcome to Storybook!</h1>
      <p>This is a test component used to test storybook development.</p>
      {props.exampleProp ? props.exampleProp : null}
      {props.onButtonClick && typeof props.onButtonClick === 'function' ? (
        <Button onClick={handleButtonClick}>Example Button</Button>
      ) : null}
    </div>
  );
}

export default StorybookLanding;
