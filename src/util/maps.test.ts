import { maps } from './maps';


describe('maps', () => {

    it('can load maps', () => {
        expect(maps).toBeInstanceOf(Array);
        expect(maps.length).toBeGreaterThan(0);
    });

});

