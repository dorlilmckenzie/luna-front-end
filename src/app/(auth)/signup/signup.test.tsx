import userEvent from '@testing-library/user-event';
import { fireEvent } from '@testing-library/react';
import { renderWithProviders, screen } from '@/test-utils';
import SignupPage from './page';

const replace = jest.fn();
const registerUser = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace, push: jest.fn() }),
}));

jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ register: registerUser, status: 'unauthenticated' }),
}));

describe('SignupPage', () => {
  beforeEach(() => {
    replace.mockReset();
    registerUser.mockReset();
  });

  it('renders all required fields', () => {
    renderWithProviders(<SignupPage />);
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date of birth/i)).toBeInTheDocument();
  });

  it('flags a password mismatch and does not submit', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SignupPage />);
    await user.type(screen.getByLabelText(/first name/i), 'Ada');
    await user.type(screen.getByLabelText(/last name/i), 'Lovelace');
    await user.type(screen.getByLabelText(/email/i), 'ada@example.com');
    await user.type(screen.getByLabelText(/^password$/i), 'Password123');
    await user.type(screen.getByLabelText(/confirm password/i), 'Password124');
    fireEvent.change(screen.getByLabelText(/date of birth/i), { target: { value: '1998-01-01' } });
    await user.click(screen.getByRole('button', { name: /sign up/i }));
    expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();
    expect(registerUser).not.toHaveBeenCalled();
  });

  it('registers a valid user and redirects to the dashboard', async () => {
    registerUser.mockResolvedValueOnce(undefined);
    const user = userEvent.setup();
    renderWithProviders(<SignupPage />);
    await user.type(screen.getByLabelText(/first name/i), 'Ada');
    await user.type(screen.getByLabelText(/last name/i), 'Lovelace');
    await user.type(screen.getByLabelText(/email/i), 'ada@example.com');
    await user.type(screen.getByLabelText(/^password$/i), 'Password123');
    await user.type(screen.getByLabelText(/confirm password/i), 'Password123');
    fireEvent.change(screen.getByLabelText(/date of birth/i), { target: { value: '1998-01-01' } });
    await user.click(screen.getByRole('button', { name: /sign up/i }));
    await screen.findByRole('button', { name: /sign up/i });
    expect(registerUser).toHaveBeenCalledTimes(1);
  });
});
