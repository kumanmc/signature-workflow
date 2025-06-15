import { Sign } from "../../store/types";
import { getStatus, SignStatus } from './index';

describe('getStatus', () => {
  test('should return "Pending" when neither signedAt nor declinedAt are defined', () => {
    const sign: Sign = {
      id: 'test-id-1',
      signedAt: null,
      declinedAt: null,
    };
    const expectedStatus: SignStatus = {
      style: 'info.main',
      label: 'Pending',
    };
    expect(getStatus(sign)).toEqual(expectedStatus);
  });

  test('should return "Signed" when signedAt is defined', () => {
    const sign: Sign = {
      id: 'test-id-2',
      signedAt: new Date(),
      declinedAt: null,
    };
    const expectedStatus: SignStatus = {
      style: 'success.main',
      label: 'Signed',
    };
    expect(getStatus(sign)).toEqual(expectedStatus);
  });

  test('should return "Declined" when declinedAt is defined and signedAt is not', () => {
    const sign: Sign = {
      id: 'test-id-3',
      signedAt: null,
      declinedAt: new Date(),
    };
    const expectedStatus: SignStatus = {
      style: 'error.main',
      label: 'Declined',
    };
    expect(getStatus(sign)).toEqual(expectedStatus);
  });

  test('should prioritize "Signed" if both signedAt and declinedAt are defined', () => {
    const sign: Sign = {
      id: 'test-id-4',
      signedAt: new Date(),
      declinedAt: new Date(),
    };
    const expectedStatus: SignStatus = {
      style: 'success.main',
      label: 'Signed',
    };
    expect(getStatus(sign)).toEqual(expectedStatus);
  });

  test('should return "Signed" if signedAt is a past date', () => {
    const sign: Sign = {
      id: 'test-id-5',
      signedAt: new Date('2024-01-15T10:00:00Z'),
      declinedAt: null,
    };
    const expectedStatus: SignStatus = {
      style: 'success.main',
      label: 'Signed',
    };
    expect(getStatus(sign)).toEqual(expectedStatus);
  });

  test('should return "Declined" if declinedAt is a past date and signedAt is not present', () => {
    const sign: Sign = {
      id: 'test-id-6',
      signedAt: null,
      declinedAt: new Date('2024-02-20T14:30:00Z'),
    };
    const expectedStatus: SignStatus = {
      style: 'error.main',
      label: 'Declined',
    };
    expect(getStatus(sign)).toEqual(expectedStatus);
  });
});