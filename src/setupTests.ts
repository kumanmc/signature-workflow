// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

if (typeof global.crypto === 'undefined') {
  global.crypto = {} as Crypto;
}

if (typeof global.crypto.randomUUID !== 'function' || global.crypto.randomUUID.name === 'mockRandomUUID') {
  Object.defineProperty(global.crypto, 'randomUUID', {
    configurable: true,
    value: jest.fn(() => {
      const timestamp = Date.now().toString(16);
      const randomPart = Math.random().toString(16).substring(2, 10);
      const uuidPart1 = timestamp.substring(0, 8).padStart(8, '0');
      const uuidPart2 = timestamp.substring(8, 12).padStart(4, '0');
      const uuidPart3 = '4' + randomPart.substring(0, 3);
      const uuidPart4 = '8' + randomPart.substring(3, 7);
      const uuidPart5 = Date.now().toString().slice(-12);
      return `${uuidPart1}-${uuidPart2}-4${uuidPart3.slice(-3)}-8${uuidPart4.slice(-3)}-${uuidPart5}`;
    }),
    writable: true,
  });
}