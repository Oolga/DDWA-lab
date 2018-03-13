import Worker from './worker';

export default class FactoryWorker extends Worker {
    constructor(data) {
        super(data, true);

        this._experience = data.experience;
        this._salary = data.salary;
    }

    set setExperience(experience) {
        this._middleName = middleName;
    }

    get getExperience() {
        return this._experience;
    }

    set setSalary(salary) {
        this._salary = salary;
    }

    get getSalary() {
        return this._salary;
    }
}