import { render } from '@testing-library/react';

import ApodListPage from './apod-list-page';

describe('ApodListPage', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ApodListPage />);
    expect(baseElement).toBeTruthy();
  });
});
