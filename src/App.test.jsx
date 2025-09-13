/// <reference types="vitest" />
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

// Mock react-confetti correctly for Vitest
vi.mock('react-confetti', () => ({
  default: () => <div data-testid="confetti" />,
}));

describe('TaxCalculator', () => {
  beforeEach(() => {
    render(<App />);
  });

  test('calculates tax correctly for 10L income', async () => {
    const salaryInput = screen.getByPlaceholderText(/Enter your salary/i);
    fireEvent.change(salaryInput, { target: { value: '1000000' } });

    const button = screen.getByRole('button', { name: /Calculate Tax/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Congrats 🎉/i)).toBeInTheDocument();
      const zeroCells = screen.getAllByText(/₹0/);
      expect(zeroCells.length).toBeGreaterThan(0);
    });
  });

  test('shows marginal relief for income above threshold', async () => {
    const salaryInput = screen.getByPlaceholderText(/Enter your salary/i);
    fireEvent.change(salaryInput, { target: { value: '2500000' } });

    const button = screen.getByRole('button', { name: /Calculate Tax/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Marginal Relief/i)).toBeInTheDocument();
    });
  });

  test('toggles between salaried and non-salaried', async () => {
  // Use getByLabelText which is more reliable for inputs inside labels
  const nonSalariedRadio = screen.getByLabelText('Non Salaried');
  fireEvent.click(nonSalariedRadio);
  expect(nonSalariedRadio).toBeChecked();

  const salariedRadio = screen.getByLabelText('Salaried');
  fireEvent.click(salariedRadio);
  expect(salariedRadio).toBeChecked();
});


  test('calculates tax for salaried user under 4L as 0', async () => {
    const salaryInput = screen.getByPlaceholderText(/Enter your salary/i);
    fireEvent.change(salaryInput, { target: { value: '300000' } });

    const button = screen.getByRole('button', { name: /Calculate Tax/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Congrats 🎉/i)).toBeInTheDocument();
      const zeroCells = screen.getAllByText(/₹0/);
      expect(zeroCells.length).toBeGreaterThan(0);
    });
  });
});
