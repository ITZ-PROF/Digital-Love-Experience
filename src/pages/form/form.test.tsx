import { fireEvent, render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Form from './form';

jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}));

const originalShowModal = HTMLDialogElement.prototype.showModal;
const originalClose = HTMLDialogElement.prototype.close;

beforeEach(() => {
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.setAttribute('open', '');
  };
  HTMLDialogElement.prototype.close = function close() {
    this.removeAttribute('open');
  };
});

afterAll(() => {
  if (originalShowModal) {
    HTMLDialogElement.prototype.showModal = originalShowModal;
  } else {
    delete (HTMLDialogElement.prototype as Partial<HTMLDialogElement>).showModal;
  }
  if (originalClose) {
    HTMLDialogElement.prototype.close = originalClose;
  } else {
    delete (HTMLDialogElement.prototype as Partial<HTMLDialogElement>).close;
  }
});

test('previews the filled birthday experience before showing payment details', () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  render(
    <QueryClientProvider client={queryClient}>
      <Form />
    </QueryClientProvider>
  );

  fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'Alex Creator' } });
  fireEvent.change(screen.getByRole('combobox'), { target: { value: 'birthday' } });
  fireEvent.click(screen.getByRole('button', { name: 'Next' }));

  fireEvent.change(screen.getByLabelText('Recipient Full Name'), { target: { value: 'Sam Recipient' } });
  fireEvent.change(screen.getByLabelText('Write your heartfelt message'), {
    target: { value: 'Happy birthday, Sam!\n\nWishing you a wonderful year.' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Next' }));

  fireEvent.click(screen.getByRole('button', { name: /view the full birthday letter template/i }));
  fireEvent.click(screen.getByRole('button', { name: 'Use this template' }));

  fireEvent.click(screen.getByRole('button', { name: 'Go to step 4: Payment Info' }));
  expect(screen.getByRole('button', { name: 'Close preview' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Close preview' }));

  fireEvent.click(screen.getByRole('button', { name: 'Proceed To Preview' }));

  expect(screen.getByRole('heading', { name: 'Happy Birthday, Sam Recipient!' })).toBeInTheDocument();
  const preview = screen.getAllByRole('main')[1];
  expect(preview).toHaveTextContent(/With all my love,\s*Alex Creator/);
  expect(preview).toHaveTextContent(/Happy birthday, Sam!\s+Wishing you a wonderful year/);
  expect(screen.getByLabelText('A birthday letter for Sam Recipient')).toHaveTextContent('Dear Sam Recipient,');
  expect(screen.getByRole('button', { name: 'Continue to payment details' })).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Continue to payment details' }));
  expect(screen.getByRole('heading', { name: 'Payment Info' })).toBeInTheDocument();
});
