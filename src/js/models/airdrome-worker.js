import Worker from './worker';

export default class AirdromeWorker extends Worker {
    constructor(data) {
        super(data, false);

        this._numberOfHoursInAir = data.numberOfHoursInAir;
        this._oldWorkplaces = data.oldWorkplaces;
    }

    set setNumberOfHoursInAir(numberOfHoursInAir) {
        this._numberOfHoursInAir = numberOfHoursInAir;
    }

    get getNumberOfHoursInAir() {
        return this._numberOfHoursInAir;
    }

    set setOldWorkplaces(oldWorkplaces) {
        this._oldWorkplaces = oldWorkplaces;
    }

    get getOldWorkplaces() {
        return this._oldWorkplaces;
    }
}