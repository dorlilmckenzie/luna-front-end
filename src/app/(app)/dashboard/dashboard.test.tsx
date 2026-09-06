import { renderWithProviders, screen } from '@/test-utils';
import DashboardPage from './page';

jest.mock('next/navigation', () => ({ useRouter: () => ({ push: jest.fn() }) }));
jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ user: { firstName: 'Ada' } }),
}));

const useSummaryMock = jest.fn();
const usePredictionMock = jest.fn();
jest.mock('@/hooks/useCycles', () => ({ useSummary: () => useSummaryMock() }));
jest.mock('@/hooks/usePredictions', () => ({ usePrediction: () => usePredictionMock() }));

describe('DashboardPage', () => {
  it('shows a loading state', () => {
    useSummaryMock.mockReturnValue({ isLoading: true });
    usePredictionMock.mockReturnValue({ isLoading: true });
    renderWithProviders(<DashboardPage />);
    expect(screen.getAllByRole('status').length).toBeGreaterThan(0);
  });

  it('shows the empty state when no periods are logged', () => {
    useSummaryMock.mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        current: { cycleDay: null, onPeriod: false, lastPeriodStart: null, lastPeriodEnd: null },
        statistics: { cyclesTracked: 0, averageCycleLength: null, averagePeriodLength: null },
      },
    });
    usePredictionMock.mockReturnValue({ isLoading: false, isError: false, data: null });
    renderWithProviders(<DashboardPage />);
    expect(screen.getByText(/no periods recorded yet/i)).toBeInTheDocument();
  });

  it('renders the current cycle day and next period estimate', () => {
    useSummaryMock.mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        current: {
          cycleDay: 12,
          onPeriod: false,
          lastPeriodStart: '2026-08-01T00:00:00.000Z',
          lastPeriodEnd: '2026-08-05T00:00:00.000Z',
        },
        statistics: {
          cyclesTracked: 4,
          averageCycleLength: 28,
          averagePeriodLength: 5,
        },
      },
    });
    usePredictionMock.mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        confidence: 'high',
        nextPeriod: {
          startDate: '2026-08-29',
          endDate: '2026-09-02',
          earliest: '2026-08-27',
          latest: '2026-08-31',
        },
        fertileWindow: { startDate: '2026-08-13', endDate: '2026-08-19' },
        ovulation: { estimatedDate: '2026-08-15' },
      },
    });
    renderWithProviders(<DashboardPage />);
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText(/your next period is expected around/i)).toBeInTheDocument();
    expect(screen.getByText(/Aug 29, 2026/)).toBeInTheDocument();
  });
});
