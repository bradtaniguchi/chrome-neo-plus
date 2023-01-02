import { render } from '@testing-library/react';

import StorybookLanding from './storybook-landing';

describe('StorybookLanding', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<StorybookLanding />);
    expect(baseElement).toBeTruthy();
  });
});
