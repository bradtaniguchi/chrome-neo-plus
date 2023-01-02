import { render } from '@testing-library/react';

import Nivl from './nivl';

describe('Nivl', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Nivl />);
    expect(baseElement).toBeTruthy();
  });
});
