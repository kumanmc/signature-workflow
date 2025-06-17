import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Header from './Header';
import userEvent from '@testing-library/user-event';
import { act as actHook } from '@testing-library/react';
import { useAppStore } from '../store';

// To allow test with custom data
const setupStoreForTest = (partialState?: Partial<ReturnType<typeof useAppStore.getState>>) => {
  actHook(() => {
    useAppStore.getState().resetAllSlices();

    if (partialState) {
      useAppStore.setState(partialState);
    }
  });
};

// We'll reset the store before each test to ensure test isolation
beforeEach(() => {
  actHook(() => {
    useAppStore.getState().resetAllSlices();
  });
});

test('renders App title', () => {
  render(<Header />);
  const linkElement = screen.getByText(/Backend/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders user select dropdown', () => {
  render(<Header />);
  const selectElement = screen.getByRole('combobox');
  expect(selectElement).toBeInTheDocument();
});

test('user clicks to see options and selects one', async () => {

  const customUsers = [
    { id: '1', name: 'Ronaldo', email: 'ronaldo@example.com' },
    { id: '2', name: 'Pique', email: 'pique@example.com' },
    { id: '3', name: 'Shakira', email: 'shakira@example.com' },
  ];
  const customCurrentUser = customUsers[0];
  setupStoreForTest({
    users: customUsers,
    currentUser: customCurrentUser,
  });

  render(<Header />);

  const autocompleteInput = screen.getByRole('combobox', { name: /Select user/i });
  await userEvent.click(autocompleteInput);

  const optionElements = await screen.findAllByRole('option');
  expect(optionElements.length).toBeGreaterThan(0);
  expect(optionElements[0]).toBeInTheDocument();
  expect(optionElements).toHaveLength(customUsers.length);

  optionElements.forEach((optionElement, index) => {
    const expectedText = `${customUsers[index].name} (${customUsers[index].email})`;
    expect(optionElement).toHaveTextContent(expectedText);
    expect(optionElement).toBeInTheDocument();
  });

});

test('user clicks to see options and selects one', async () => {

  const customUsers = [
    { id: '1', name: 'Ronaldo', email: 'ronaldo@example.com' },
    { id: '2', name: 'Pique', email: 'pique@example.com' },
    { id: '3', name: 'Shakira', email: 'shakira@example.com' },
  ];
  const customCurrentUser = customUsers[0];
  setupStoreForTest({
    users: customUsers,
    currentUser: customCurrentUser,
  });

  render(<Header />);

  const autocompleteInput = screen.getByRole('combobox', { name: /Select user/i });

  // How to select value on material autocomplete
  await userEvent.type(autocompleteInput, '{enter}');
  fireEvent.click(screen.getByRole('button'));
  await waitFor(() => {
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });
  const shakiraOption = await screen.findByRole('option', { name: 'Shakira (shakira@example.com)' });

  fireEvent.click(shakiraOption);
  await waitFor(() => {
    expect(autocompleteInput).toHaveValue('Shakira (shakira@example.com)');
  });

});
