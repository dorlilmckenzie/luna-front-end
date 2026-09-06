import userEvent from '@testing-library/user-event';
import { renderWithProviders, screen, waitFor } from '@/test-utils';
import LoginPage from './page';

const replace = jest.fn();
const login = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace, push: jest.fn() }),
}));

jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ login, status: 'unauthenticated' }),
}));

describe('LoginPage', () => {
  beforeEach(() => {
    replace.mockReset();
    login.mockReset();
  });

  it('renders email and password fields', () => {
    renderWithProviders(<LoginPage />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /forgot password/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /create an account/i })).toBeInTheDocument();
  });

  it('shows validation errors when submitting empty', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />);
    await user.click(screen.getByRole('button', { name: /log in/i }));
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(login).not.toHaveBeenCalled();
  });

  it('submits valid credentials and redirects to the dashboard', async () => {
    login.mockResolvedValueOnce(undefined);
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />);
    await user.type(screen.getByLabelText(/email/i), 'demo@example.com');
    await user.type(screen.getByLabelText(/password/i), 'Password123');
    await user.click(screen.getByRole('button', { name: /log in/i }));
    await waitFor(() => expect(login).toHaveBeenCalledWith('demo@example.com', 'Password123'));
    await waitFor(() => expect(replace).toHaveBeenCalledWith('/dashboard'));
  });

  it('shows a friendly error when login fails', async () => {
    login.mockRejectedValueOnce(new Error('bad'));
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />);
    await user.type(screen.getByLabelText(/email/i), 'demo@example.com');
    await user.type(screen.getByLabelText(/password/i), 'wrongpass');
    await user.click(screen.getByRole('button', { name: /log in/i }));
    expect(await screen.findByText(/email or password is incorrect/i)).toBeInTheDocument();
  });
});
