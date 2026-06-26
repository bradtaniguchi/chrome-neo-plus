import { render } from '@testing-library/react';
import { ViewMonthly } from './ViewMonthly';
import { useNeoDashboard } from '../neo-dashboard/use-neo-dashboard';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../neo-dashboard/use-neo-dashboard', () => ({
  useNeoDashboard: jest.fn(),
}));

jest.mock('react-charts', () => ({
  Chart: () => <div data-testid="mock-chart">Mock Chart</div>,
}));

describe('ViewMonthly', () => {
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
        <ViewMonthly />
      </MemoryRouter>
    );

    expect(baseElement).toBeTruthy();
    expect(getByLabelText(/Loading near earth objects.../i)).toBeTruthy();
  });

  it('should render error message when error occurs', () => {
    mockUseNeoDashboard.mockReturnValue({
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

    mockUseNeoDashboard.mockReturnValue({
      loading: false,
      error: null,
      neosResponse: mockNeosResponse,
      aggregateSummary: {
        totalCount: 1,
        hazardousCount: 1,
        hazardousPercentage: '100.0',
        closestKm: '5,000,000',
        closestNeoName: 'Asteroid Monthly 1',
        largestMeters: '20',
        largestNeoName: 'Asteroid Monthly 1',
      },
      weeklySummaryMonthly: [
        {
          start: '2026-06-01',
          end: '2026-06-07',
          count: 1,
          link: '/neows/weekly/2026-06-01',
        },
      ],
      dailySummaryMonthly: [
        {
          date: '2026-06-01',
          dayLabel: 'Jun 01',
          count: 1,
          link: '/neows/daily/2026-06-01',
        },
      ],
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
        getValue: (d: any) => d.date,
      },
      secondaryAxes: [
        {
          getValue: (d: any) => d.count,
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
    expect(getByText('Near-Earth Objects Frequency Distribution')).toBeTruthy(); // updated label
    expect(getByTestId('mock-chart')).toBeTruthy();
    // check stats
    expect(getByText('Total NEOs')).toBeTruthy();
    expect(getByText('Hazardous NEOs')).toBeTruthy();
  });
});

