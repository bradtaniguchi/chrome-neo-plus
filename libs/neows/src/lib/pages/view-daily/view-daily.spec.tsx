import { render } from '@testing-library/react';
import { ViewDaily } from './view-daily';
import { useNeoDashboard } from '../neo-dashboard/use-neo-dashboard';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../neo-dashboard/use-neo-dashboard', () => ({
  useNeoDashboard: jest.fn(),
}));

jest.mock('react-charts', () => ({
  Chart: () => <div data-testid="mock-chart">Mock Chart</div>,
}));

describe('ViewDaily', () => {
  const mockUseNeoDashboard = useNeoDashboard as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading spinner when loading is true', () => {
    mockUseNeoDashboard.mockReturnValue({
      loading: true,
      error: null,
      neosResponse: null,
      chartData: [],
      primaryAxis: {},
      secondaryAxes: [],
    });

    const { baseElement, getByLabelText } = render(
      <MemoryRouter>
        <ViewDaily />
      </MemoryRouter>
    );

    expect(baseElement).toBeTruthy();
    expect(getByLabelText(/Loading near earth objects.../i)).toBeTruthy();
  });

  it('should render error message when error occurs', () => {
    mockUseNeoDashboard.mockReturnValue({
      loading: false,
      error: new Error('Failed to fetch data'),
      neosResponse: null,
      chartData: [],
      primaryAxis: {},
      secondaryAxes: [],
    });

    const { baseElement, getByText } = render(
      <MemoryRouter>
        <ViewDaily />
      </MemoryRouter>
    );

    expect(baseElement).toBeTruthy();
    expect(getByText(/Failed to fetch data/i)).toBeTruthy();
  });

  it('should render NEO list when data is loaded', () => {
    const mockNeosResponse = {
      near_earth_objects: {
        '2026-06-21': [
          {
            id: '12345',
            neo_reference_id: 'REF-12345',
            name: 'Asteroid 1',
            nasa_jpl_url: 'http://jpl.nasa.gov/12345',
            estimated_diameter: {
              meters: {
                estimated_diameter_min: 10,
                estimated_diameter_max: 20,
              },
            },
            is_potentially_hazardous_asteroid: true,
            close_approach_data: [
              {
                close_approach_date: '2026-06-21',
                close_approach_date_full: '2026-Jun-21 12:00',
                miss_distance: {
                  kilometers: '5000000',
                },
                orbiting_body: 'Earth',
              },
            ],
          },
        ],
      },
    };

    mockUseNeoDashboard.mockReturnValue({
      loading: false,
      error: null,
      neosResponse: mockNeosResponse,
      chartData: [
        {
          label: 'size',
          data: [
            {
              name: 'Asteroid 1',
              size: 20,
              distance: 5000000,
            },
          ],
        },
      ],
      primaryAxis: {
        getValue: (d: any) => d.name,
      },
      secondaryAxes: [
        {
          getValue: (d: any) => d.size,
        },
      ],
    });

    const { baseElement, getByText } = render(
      <MemoryRouter>
        <ViewDaily date="2026-06-21" />
      </MemoryRouter>
    );

    expect(baseElement).toBeTruthy();
    expect(getByText('Asteroid 1')).toBeTruthy();
    expect(getByText('REF-12345')).toBeTruthy();
    expect(getByText('Hazardous')).toBeTruthy(); // updated to 'Hazardous' matching our mock data
    expect(getByText('10.0 - 20.0')).toBeTruthy();
    expect(getByText('2026-Jun-21 12:00')).toBeTruthy();
    expect(getByText('5,000,000')).toBeTruthy();
  });
});


