import { fireEvent, render, screen } from '@testing-library/react';
import CTA from './ctasection';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

beforeEach(() => {
  mockNavigate.mockClear();
});

test('Create Experience CTA navigates to the form like the navbar CTA', () => {
  render(<CTA />);

  fireEvent.click(screen.getByRole('button', { name: 'Create Experience' }));
  expect(mockNavigate).toHaveBeenCalledWith('/form');
});
