var _ = require('lodash');

getSlotsFromMessage = (text, reg) => {
    reg = reg || /([\d.]+)/g;
    var result = reg.exec(text);
    var slots = [];
    while (result) {
        slots.push(result[1]);
        result = reg.exec(text);
    }
    return slots;
};

function slotsHandler() {
    this.SLOTS = [];
    this.FREE_SLOTS = [];

    this.removeSlots = text => {
        var slotsToRemove = getSlotsFromMessage(text);
        _.pullAll(this.SLOTS, slotsToRemove);
        this.FREE_SLOTS = _.uniq(_.pullAll(this.FREE_SLOTS, slotsToRemove));
    };

    this.addSlots = text => {
        var slotsToAdd = getSlotsFromMessage(text);
        this.SLOTS = _.uniq(this.SLOTS.concat(slotsToAdd));
        this.FREE_SLOTS = _.uniq(this.FREE_SLOTS.concat(slotsToAdd));
    };

    this.setSlots = text => {
        var slotsToAdd = getSlotsFromMessage(text);
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
        var addFreeSlot = getSlotsFromMessage(text, /-([\d.]+)/g);
        var removeFreeSlot = _.pullAll(getSlotsFromMessage(text), addFreeSlot);
        console.log(this.FREE_SLOTS);
        console.log('add', addFreeSlot, 'remove', removeFreeSlot);
        _.pullAll(this.FREE_SLOTS, removeFreeSlot);
        this.FREE_SLOTS = _.uniq(this.FREE_SLOTS.concat(_.intersection(addFreeSlot, this.SLOTS)));

        return removeFreeSlot.length || addFreeSlot.length;
    };
}

module.exports = new slotsHandler();
