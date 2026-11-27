import { fireEvent, render, screen } from '@testing-library/react';
import Navbar from './Navbar';
import { useAuth } from '../../stores/authstore';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  Link: ({ to, children, ...props }: { to: string; children: React.ReactNode; [key: string]: unknown }) =>
    require('react').createElement('a', { href: to, ...props }, children),
  useNavigate: () => mockNavigate,
}));

beforeEach(() => {
  mockNavigate.mockClear();
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: 390 });
  useAuth.getState().setUnauthenticated();
});

test('links pricing, contact, sign-up, and log-in and closes the accessible mobile menu on selection', () => {
  render(<Navbar />);

  const toggle = screen.getByRole('button', { name: 'Open navigation menu' });
  expect(toggle).toHaveAttribute('aria-expanded', 'false');
  expect(toggle).toHaveAttribute('aria-controls', 'navbar-links');

  fireEvent.click(toggle);
  expect(screen.getByRole('button', { name: 'Close navigation menu' })).toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByRole('link', { name: 'Pricing' })).toHaveAttribute('href', '/pricing');
  expect(screen.getByRole('link', { name: 'Contact Us' })).toHaveAttribute('href', '/contact');
  expect(screen.getByRole('link', { name: 'Sign up' })).toHaveAttribute('href', '/login?mode=signup');
  expect(screen.getByRole('link', { name: 'Log in' })).toHaveAttribute('href', '/login?mode=login');

  fireEvent.click(screen.getByRole('link', { name: 'Contact Us' }));
  expect(screen.getByRole('button', { name: 'Open navigation menu' })).toHaveAttribute('aria-expanded', 'false');
});

test('keeps the authenticated user icon as the dashboard entry instead of adding a dashboard link', () => {
  useAuth.getState().setAuthenticated({
    id: 'creator-id',
    fullName: 'Alex Creator',
    email: 'alex@example.com',
    emailVerifiedAt: '2026-01-01T00:00:00.000Z',
  });

  render(<Navbar />);

  expect(screen.queryByRole('link', { name: 'Sign up' })).not.toBeInTheDocument();
  expect(screen.queryByRole('link', { name: 'Log in' })).not.toBeInTheDocument();
  expect(screen.queryByRole('link', { name: 'Dashboard' })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Open your dashboard' }));
  expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
});
