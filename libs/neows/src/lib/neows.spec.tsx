import { render } from '@testing-library/react';

import Neows from './neows';

describe('Neows', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Neows />);
    expect(baseElement).toBeTruthy();
  });
});
