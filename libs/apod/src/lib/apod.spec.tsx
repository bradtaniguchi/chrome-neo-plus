import { render } from '@testing-library/react';

import Apod from './apod';

describe('Apod', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Apod />);
    expect(baseElement).toBeTruthy();
  });
});
