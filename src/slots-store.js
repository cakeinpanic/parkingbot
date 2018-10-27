let _ = require('lodash');
const config = require('./config');

const SLOT_REG = /(\d+\.?\d*)/g;
const FREE_SLOT_REG = /-(\d+\.?\d*)/g;

getSlotsFromMessage = (text, reg) => {
    reg = reg || SLOT_REG;
    let result = reg.exec(text);
    let slots = [];
    while (result) {
        slots.push(result[1]);
        result = reg.exec(text);
    }
    return slots;
};

function SlotsStore() {
    this.SLOTS = config.SLOTS_PRESET ? config.SLOTS_PRESET.split(',') : [];
    this.FREE_SLOTS = config.TAKEN_PRESET ? _.difference(this.SLOTS, config.TAKEN_PRESET.split(',')) : this.SLOTS;

    this.removeSlots = text => {
        let slotsToRemove = getSlotsFromMessage(text);
        _.pullAll(this.SLOTS, slotsToRemove);
        this.FREE_SLOTS = _.uniq(_.pullAll(this.FREE_SLOTS, slotsToRemove));
    };

    this.addSlots = text => {
        let slotsToAdd = getSlotsFromMessage(text);
        this.SLOTS = _.uniq(this.SLOTS.concat(slotsToAdd));
        this.FREE_SLOTS = _.uniq(this.FREE_SLOTS.concat(slotsToAdd));
    };

    this.setSlots = text => {
        let slotsToAdd = getSlotsFromMessage(text);
        this.SLOTS = _.uniq(slotsToAdd);
        this.FREE_SLOTS = [].concat(this.SLOTS);
    };

    this.getAllSots = () => {
        return this.SLOTS.sort();
    };

    this.getFreeSots = () => {
        return this.FREE_SLOTS.sort();
    };

    this.resetFreeSLOTS = () => {
        if (this.FREE_SLOTS.length !== this.SLOTS.length) {
            this.FREE_SLOTS = [].concat(this.SLOTS);
            return true;
        }
        return false;
    };

    this.takeOrRemoveSlot = text => {
        let addFreeSlot = getSlotsFromMessage(text, FREE_SLOT_REG);
        let removeFreeSlot = _.pullAll(getSlotsFromMessage(text), addFreeSlot);
        let last = _.clone(this.FREE_SLOTS);

        _.pullAll(this.FREE_SLOTS, removeFreeSlot);
        this.FREE_SLOTS = _.uniq(this.FREE_SLOTS.concat(_.intersection(addFreeSlot, this.SLOTS)));

        return !_.isEqual(last, this.FREE_SLOTS)
    };
}

module.exports = new SlotsStore();
