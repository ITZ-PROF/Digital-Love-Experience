import { render, screen } from '@testing-library/react';
import { useLocation } from 'react-router-dom';
import Login from './login';
import { useAuth } from '../../stores/authstore';

jest.mock('react-router-dom', () => ({
    Link: ({ children }: { children: React.ReactNode }) => children,
    Navigate: ({ to }: { to: string }) => <p data-testid="redirect-destination">{to}</p>,
    useLocation: jest.fn(),
    useNavigate: () => jest.fn(),
}));

jest.mock('../../hooks/use-auth', () => ({
    useLogin: () => ({ mutate: jest.fn(), isPending: false }),
    useRegister: () => ({ mutate: jest.fn(), isPending: false }),
}));

const renderLogin = (state?: { from?: { pathname?: string } }) => {
    jest.mocked(useLocation).mockReturnValue({
        pathname: '/login',
        search: '',
        hash: '',
        state,
        key: 'test',
    });
    return render(<Login />);
};

beforeEach(() => {
    useAuth.getState().setAuthenticated({
        id: 'creator-id',
        fullName: 'Alex Creator',
        email: 'alex@example.com',
        emailVerifiedAt: '2026-01-01T00:00:00.000Z',
    });
});

test('sends an authenticated user from the login route to the dashboard by default', () => {
    renderLogin();

    expect(screen.getByTestId('redirect-destination')).toHaveTextContent('/dashboard');
});

test('preserves the form destination when authentication was required to create an experience', () => {
    renderLogin({ from: { pathname: '/form' } });

    expect(screen.getByTestId('redirect-destination')).toHaveTextContent('/form');
});
