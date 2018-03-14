export default  class Worker {

    constructor(data, type) {
        this._id = data.id;
        this._firstname = data.firstname;
        this._lastname = data.lastname;
        this._middleName = data.middlename;
        this._isMarried = data.isMarried;
        this._gender = data.gender;
        this._position = data.position;
        this._type = type;
    }

    get getId() {
        return this._id;
    }

    get getType() {
        return this._type;
    }

    set setFirstname(firstname) {
        this._firstname = firstname;
    }

    get getFirstname() {
        return this._firstname;
    }

    set setLastname(lastname) {
        this._lastname = lastname;
    }

    get getLastname() {
        return this._lastname;
    }

    set setMiddleName(middleName) {
        this._middleName = middleName;
    }

    get getMiddleName() {
        return this._middleName;
    }

    set setMerriedStatus(marriedStatus) {
        this._isMarried = marriedStatus;
    }

    get getMerriedStatus() {
        return this._isMarried;
    }

    set setGender(gender) {
        this._gender = gender;
    }

    get getGender() {
        return this._gender;
    }

    set setPosition(position) {
        this._position = position;
    }

    get getPosition() {
        return this._position;
    }
}