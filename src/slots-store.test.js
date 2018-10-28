const config = require('./config');

describe('slotsStore', () => {
    config.SLOTS_PRESET = '1,4,5';
    config.TAKEN_PRESET = '5 8';

    const SlotsStore = require('./slots-store');

    describe('using NODE_ENV configs', () => {
        it('preconfigured slots are stored', ()=>{
            expect(SlotsStore.getFreeSots()).toEqual(['1', '4']);
            expect(SlotsStore.getAllSots()).toEqual(['1', '4', '5']);
        })
    });

    describe('setting slots', () => {
        test('simple', () => {
            SlotsStore.setSlots('1 4 6');
            expect(SlotsStore.getFreeSots()).toEqual(['1', '4', '6']);
            expect(SlotsStore.getAllSots()).toEqual(['1', '4', '6']);
        });

        test('with doubles', () => {
            SlotsStore.setSlots('1 4 6,4');
            expect(SlotsStore.getFreeSots()).toEqual(['1', '4', '6']);
            expect(SlotsStore.getAllSots()).toEqual(['1', '4', '6']);
        });

        test('overwrite', () => {
            SlotsStore.setSlots('1 4 6');
            SlotsStore.setSlots('8 9 1.0');
            expect(SlotsStore.getFreeSots()).toEqual(['1.0', '8', '9']);
            expect(SlotsStore.getAllSots()).toEqual(['1.0', '8', '9']);
        });


        test('if some is taken already', () => {
            SlotsStore.setSlots('1 4 6');
            SlotsStore.takeOrRemoveSlot('4,1');
            SlotsStore.setSlots('8 9 1.0');
            expect(SlotsStore.getFreeSots()).toEqual(['1.0', '8', '9']);
            expect(SlotsStore.getAllSots()).toEqual(['1.0', '8', '9']);
        });
    });

    describe('adding slots', () => {
        test('simple', () => {
            SlotsStore.setSlots('1 4 6');
            SlotsStore.addSlots('7');
            expect(SlotsStore.getFreeSots()).toEqual(['1', '4', '6', '7']);
            expect(SlotsStore.getAllSots()).toEqual(['1', '4', '6', '7']);
        });

        test('with doubles', () => {
            SlotsStore.setSlots('1 4 6');
            SlotsStore.addSlots('6,1');
            expect(SlotsStore.getFreeSots()).toEqual(['1', '4', '6']);
            expect(SlotsStore.getAllSots()).toEqual(['1', '4', '6']);
        });

        test('if some is taken already', () => {
            SlotsStore.setSlots('1 4 6');
            SlotsStore.takeOrRemoveSlot('4');
            SlotsStore.addSlots('7');
            expect(SlotsStore.getFreeSots()).toEqual(['1', '6', '7']);
            expect(SlotsStore.getAllSots()).toEqual(['1', '4', '6', '7']);
        });
    });

    describe('removing slots', () => {
        test('simple', () => {
            SlotsStore.setSlots('1 4 6');
            SlotsStore.removeSlots('1');
            expect(SlotsStore.getFreeSots()).toEqual(['4', '6']);
            expect(SlotsStore.getAllSots()).toEqual(['4', '6']);
        });

        test('non-existent', () => {
            SlotsStore.setSlots('1 4 6');
            SlotsStore.removeSlots('85');
            expect(SlotsStore.getFreeSots()).toEqual(['1', '4', '6']);
            expect(SlotsStore.getAllSots()).toEqual(['1', '4', '6']);
        });

        test('if some is taken already', () => {
            SlotsStore.setSlots('1 4 6');
            SlotsStore.takeOrRemoveSlot('4,1');
            SlotsStore.removeSlots('4');
            expect(SlotsStore.getFreeSots()).toEqual(['6']);
            expect(SlotsStore.getAllSots()).toEqual(['1', '6']);
        });
    });

    describe('taking and removing slots', () => {
        test('simple', () => {
            SlotsStore.setSlots('1 4 6');
            SlotsStore.takeOrRemoveSlot('1,4');
            expect(SlotsStore.getFreeSots()).toEqual(['6']);
        });

        test('non-existent', () => {
            SlotsStore.setSlots('1 4 6');
            SlotsStore.takeOrRemoveSlot('1 and 22, -2');
            expect(SlotsStore.getFreeSots()).toEqual(['4', '6']);
        });

        test('useless ', () => {
            SlotsStore.setSlots('1 4 6');
            SlotsStore.takeOrRemoveSlot('-1,1');
            expect(SlotsStore.getFreeSots()).toEqual(['1', '4', '6']);
        });

        test('few commands', () => {
            SlotsStore.setSlots('1 4 6');
            SlotsStore.takeOrRemoveSlot('1');
            SlotsStore.takeOrRemoveSlot('-1 4');
            expect(SlotsStore.getFreeSots()).toEqual(['1', '6']);
        });

        test('returning changes status', () => {
            SlotsStore.setSlots('1 4 6');
            expect(SlotsStore.takeOrRemoveSlot('1 4')).toBe(true);
            expect(SlotsStore.takeOrRemoveSlot('-1')).toBe(true);
            expect(SlotsStore.takeOrRemoveSlot('1 -1')).toBe(false);
            expect(SlotsStore.takeOrRemoveSlot('some words')).toBe(false);
            expect(SlotsStore.takeOrRemoveSlot('88')).toBe(false);
        });
    });



});