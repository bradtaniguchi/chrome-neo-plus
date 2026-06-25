import { render } from '@testing-library/react';
import { ViewMonthly } from './ViewMonthly';
import { useViewMonthly } from './use-view-monthly';
import { MemoryRouter } from 'react-router-dom';

jest.mock('./use-view-monthly', () => ({
  useViewMonthly: jest.fn(),
}));

jest.mock('react-charts', () => ({
  Chart: () => <div data-testid="mock-chart">Mock Chart</div>,
}));

describe('ViewMonthly', () => {
  const mockUseViewMonthly = useViewMonthly as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading spinner when loading is true', () => {
    mockUseViewMonthly.mockReturnValue({
      loading: true,
      error: null,
      neosResponse: null,
      chartData: [],
      primaryAxis: {},
      secondaryAxes: [],
    });

    const { baseElement, getByLabelText } = render(
      <MemoryRouter>
        <ViewMonthly />
      </MemoryRouter>
    );

    expect(baseElement).toBeTruthy();
    expect(getByLabelText(/Loading near earth objects.../i)).toBeTruthy();
  });

  it('should render error message when error occurs', () => {
    mockUseViewMonthly.mockReturnValue({
      loading: false,
      error: new Error('Failed to fetch monthly data'),
      neosResponse: null,
      chartData: [],
      primaryAxis: {},
      secondaryAxes: [],
    });

    const { baseElement, getByText } = render(
      <MemoryRouter>
        <ViewMonthly />
      </MemoryRouter>
    );

    expect(baseElement).toBeTruthy();
    expect(getByText(/Failed to fetch monthly data/i)).toBeTruthy();
  });

  it('should render monthly overview when data is loaded', () => {
    const mockNeosResponse = {
      near_earth_objects: {
        '2026-06-01': [
          {
            id: '12345',
            neo_reference_id: 'REF-12345',
            name: 'Asteroid Monthly 1',
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
                close_approach_date: '2026-06-01',
                close_approach_date_full: '2026-Jun-01 12:00',
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

    mockUseViewMonthly.mockReturnValue({
      loading: false,
      error: null,
      neosResponse: mockNeosResponse,
      chartData: [
        {
          label: 'NEOs per Day',
          data: [
            {
              date: '01',
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
        <ViewMonthly date="2026-06-01" />
      </MemoryRouter>
    );

    expect(baseElement).toBeTruthy();
    expect(getAllByText('Asteroid Monthly 1').length).toBeGreaterThan(0);
    expect(getByText('Monthly Near Earth Objects Frequency')).toBeTruthy();
    expect(getByTestId('mock-chart')).toBeTruthy();
    // check stats
    expect(getByText('Total NEOs')).toBeTruthy();
    expect(getByText('Hazardous NEOs')).toBeTruthy();
  });
});
