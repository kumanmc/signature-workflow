import { generateGUID } from './index';

describe('generateGUID', () => {
    it('should generate a valid GUID', () => {
        const guid = generateGUID();
        expect(guid).toMatch(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
        );
    });

    it('should generate unique GUIDs on multiple calls', () => {
        const guid1 = generateGUID();
        const guid2 = generateGUID();
        expect(guid1).not.toEqual(guid2);
    });

    it('should return a string', () => {
        const guid = generateGUID();
        expect(typeof guid).toBe('string');
    });

    it('should not contain uppercase letters', () => {
        const guid = generateGUID();
        expect(guid).toEqual(guid.toLowerCase());
    });
});