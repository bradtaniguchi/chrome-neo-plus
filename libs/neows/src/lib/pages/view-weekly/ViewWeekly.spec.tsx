import { render } from '@testing-library/react';
import { ViewWeekly } from './view-weekly';
import { useViewWeekly } from './use-view-weekly';
import { MemoryRouter } from 'react-router-dom';

jest.mock('./use-view-weekly', () => ({
  useViewWeekly: jest.fn(),
}));

jest.mock('react-charts', () => ({
  Chart: () => <div data-testid="mock-chart">Mock Chart</div>,
}));

describe('ViewWeekly', () => {
  const mockUseViewWeekly = useViewWeekly as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading spinner when loading is true', () => {
    mockUseViewWeekly.mockReturnValue({
      loading: true,
      error: null,
      neosResponse: null,
      dailyResponse: [],
      chartData: [],
      primaryAxis: {},
      secondaryAxes: [],
    });

    const { baseElement, getByLabelText } = render(
      <MemoryRouter>
        <ViewWeekly />
      </MemoryRouter>
    );

    expect(baseElement).toBeTruthy();
    expect(getByLabelText(/Loading near earth objects.../i)).toBeTruthy();
  });

  it('should render error message when error occurs', () => {
    mockUseViewWeekly.mockReturnValue({
      loading: false,
      error: new Error('Failed to fetch weekly data'),
      neosResponse: null,
      dailyResponse: [],
      chartData: [],
      primaryAxis: {},
      secondaryAxes: [],
    });

    const { baseElement, getByText } = render(
      <MemoryRouter>
        <ViewWeekly />
      </MemoryRouter>
    );

    expect(baseElement).toBeTruthy();
    expect(getByText(/Failed to fetch weekly data/i)).toBeTruthy();
  });

  it('should render weekly overview when data is loaded', () => {
    const mockNeosResponse = {
      near_earth_objects: {
        '2026-06-21': [
          {
            id: '12345',
            neo_reference_id: 'REF-12345',
            name: 'Asteroid Weekly 1',
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

    mockUseViewWeekly.mockReturnValue({
      loading: false,
      error: null,
      neosResponse: mockNeosResponse,
      dailyResponse: [
        [
          'sunday',
          '2026-06-21',
          mockNeosResponse.near_earth_objects['2026-06-21'],
        ],
      ],
      chartData: [
        {
          label: 'sunday',
          data: [
            {
              day: 'sunday',
              date: '2026-06-21',
              count: 1,
            },
          ],
        },
      ],
      primaryAxis: {
        getValue: (d: { date: string }) => d.date,
      },
      secondaryAxes: [
        {
          getValue: (d: { count: number }) => d.count,
        },
      ],
    });

    const { baseElement, getByText, getAllByText, getByTestId } = render(
      <MemoryRouter>
        <ViewWeekly date="2026-06-21" />
      </MemoryRouter>
    );

    expect(baseElement).toBeTruthy();
    expect(getAllByText('Sunday').length).toBeGreaterThan(0);
    expect(getByText('Weekly Near Earth Objects Frequency')).toBeTruthy();
    expect(getByTestId('mock-chart')).toBeTruthy();
    // check stats
    expect(getByText('Total NEOs')).toBeTruthy();
    expect(getByText('Hazardous NEOs')).toBeTruthy();
  });
});
