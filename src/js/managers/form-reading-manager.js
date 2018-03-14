export function getDataForm(form){
    let type = form["type"].value;
    let data = {};

    if (type == 'false') {
        data = getDataFormAirdromeWorker(form);
    } else {
        data = getDataFormFactoryWorker(form);
    };

    return data;
};

function getCommonDataFromForm(form) {
    let body = {
        firstname: form["firstname"].value,
        lastname: form["lastname"].value,
        middlename: form["middlename"].value,
        type: form["type"].value,
        position: form["position"].value,
        gender: form["gender"].value,
        isMarried: form["isMarried"].checked
    };

    return body
};

function getDataFormFactoryWorker(form) {
    let data = getCommonDataFromForm(form);

    data.experience = form["experience"].value;
    data.salary = form["salary"].value;
    data.startDate = form["startDate"].value;

    return data;
};

function getDataFormAirdromeWorker(form) {
    let data = getCommonDataFromForm(form);

    data.numberOfHoursInAir = form["numberOfHoursInAir"].value;
    data.oldWorkplaces = form["oldWorkplaces"].value;

    return data;
};

function convertChackbocxValueToBool(value) {
    return value === "on" ? true : false;
}