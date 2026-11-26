import { render, screen } from '@testing-library/react';
import BirthdayTemplate1 from './BirthdayTemplate1';

jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}));

test('renders the uploaded image URL provided through template data', () => {
  const uploadedImageUrl = 'https://storage.example.test/signed-uploaded-image.jpg';

  render(
    <BirthdayTemplate1
      data={{
        heroImageUrl: uploadedImageUrl,
        heroImageAlt: 'Uploaded birthday photo',
      }}
      showCreateCta={false}
    />
  );

  expect(screen.getByAltText('Uploaded birthday photo')).toHaveAttribute('src', uploadedImageUrl);
});
