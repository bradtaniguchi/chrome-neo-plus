import { render } from '@testing-library/react';

import AppBar from './app-bar';
import { MemoryRouter } from 'react-router-dom';

describe('AppBar', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <MemoryRouter>
        <AppBar />
      </MemoryRouter>
    );
    expect(baseElement).toBeTruthy();
  });
});
