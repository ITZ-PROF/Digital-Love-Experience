import { fireEvent, render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Form from './form';

jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}));

const originalShowModal = HTMLDialogElement.prototype.showModal;
const originalClose = HTMLDialogElement.prototype.close;

beforeEach(() => {
  URL.createObjectURL = jest.fn(() => 'blob:experience-photo');
  URL.revokeObjectURL = jest.fn();
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

  expect(document.querySelector('.template-cards-grid')).toBeInTheDocument();
  const image = new File(['birthday photo'], 'birthday.png', { type: 'image/png' });
  fireEvent.change(screen.getByLabelText('Upload a birthday photo'), {
    target: { files: [image] },
  });
  expect(screen.getByAltText('Selected for Sam Recipient')).toHaveAttribute('src', 'blob:experience-photo');

  fireEvent.click(screen.getByRole('button', { name: 'Green color palette' }));
  fireEvent.click(screen.getByLabelText('Light'));
  fireEvent.click(screen.getByRole('button', { name: /view the full birthday letter template/i }));
  fireEvent.click(screen.getByRole('button', { name: 'Use this template' }));

  fireEvent.click(screen.getByRole('button', { name: 'Go to step 4: Payment Details' }));
  expect(screen.getByRole('button', { name: 'Close preview' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Close preview' }));

  fireEvent.click(screen.getByRole('button', { name: 'Proceed To Preview' }));

  expect(screen.getByRole('heading', { name: 'Happy Birthday, Sam Recipient!' })).toBeInTheDocument();
  const preview = screen.getByRole('dialog', { name: 'Your birthday experience' });
  expect(preview.querySelector('.birthday-template-container')).toHaveClass('experience-color-green', 'experience-theme-light');
  expect(preview.querySelector('.hero-image-frame')).toHaveAttribute('alt', 'Birthday celebration for Sam Recipient');
  expect(preview.querySelector('.hero-image-frame')).toHaveAttribute('src', 'blob:experience-photo');
  expect(preview).toHaveTextContent(/With all my love,\s*Alex Creator/);
  expect(preview).toHaveTextContent('A personal DLE celebration made to honor the people and moments you love.');
  expect(screen.getByText('Happy birthday, Sam!', { selector: '.letter-content p' })).toBeInTheDocument();
  expect(screen.getByText('Wishing you a wonderful year.', { selector: '.letter-content p' })).toBeInTheDocument();
  expect(screen.getByLabelText('A birthday letter for Sam Recipient')).toHaveTextContent('Dear Sam Recipient,');
  expect(screen.getByRole('button', { name: 'Continue to payment details' })).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Continue to payment details' }));
  expect(screen.getByRole('heading', { name: 'Payment Details' })).toBeInTheDocument();
  expect(screen.getByLabelText('Preferred Payment Method')).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('Preferred Payment Method'), { target: { value: 'momo' } });
  expect(screen.queryByLabelText('Mobile Money Number')).not.toBeInTheDocument();
  expect(screen.getByText(/Paystack collects the required payment details there/i)).toBeInTheDocument();
});
