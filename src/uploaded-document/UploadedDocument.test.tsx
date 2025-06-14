import React from 'react';
import { render, screen } from '@testing-library/react';
import UploadedDocument from './UploadedDocument';
import { Document } from '../store/types';

describe('UploadedDocument Component', () => {

  it('renders the document details correctly', () => {
    const mockDocument : Document = {
      id: '1',
      name: 'Test Document',
      uploadedAt: new Date('2023-10-01T00:00:00.000Z'),
      uploadedByUserId: '123',
      file: new File([''], 'test-document.pdf', { type: 'application/pdf' }),
      signs: [],
    };

    render(<UploadedDocument {...mockDocument} />);
    expect(screen.getByText(mockDocument.name)).toBeInTheDocument();
    expect(screen.getByText('Uploaded on: 01/10/2023, 02:00')).toBeInTheDocument();
    expect(screen.getByLabelText('Document')).toBeInTheDocument();
  });
});
