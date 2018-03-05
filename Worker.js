'use strict';

var DDWAApp = (function () {
    return {
        Models: {
            Worker: {},
            FactoryWorker: {},
            AirdromeWorker: {}
        },
        Mappers: {
            MapperFactory: {}
        },
        MakeupManager: {
            MakeupCreator: {},
            FormReader: {},
            ElementsEventsProvider: {},
            WorkersFormValidator: {}
        },
        WorkersService: {},
        CONSTANTS: {
            SERVICE_URL: 'http://localhost:3000/workers',
            TABLE_ID: 'workersList',
            DETAILS_TABLE_ID: 'tableDetails',
            FORM_WORKER_ID: 'formWorker',
            CREATE_PART: 'createPart',
            LIST_PART: 'showPart',
            CREATE_WORKER_BUTTON: 'createWorker',
            CREATE_FACTORY_WORKER_BUTTON: 'createFactoryWorker',
            CREATE_AIRDROME_WORKER_BUTTON: 'createAirdromeWorker',
            CREATE_BUTTONS_ID: 'createButtons'
        }
    };
})();

DDWAApp.Models.Worker = function(type) {

    var _id;
    var _firstname;
    var _lastname;
    var _middlename;
    var _isMarried;
    var _gender;
    var _position;
    var _type = type;

    this.initialize = function (data) {
        _id = data.id;
        _firstname = data.firstname;
        _lastname = data.lastname;
        _middlename = data.middlename;
        _isMarried = data.isMarried;
        _gender = data.gender;
        _position = data.position;
    }

    this.getId = function () {
        return _id;
    }

    this.getType = function() {
        return _type;
    }

    this.setFirstname = function (firstname) {
        _firstname = firstname;
    }

    this.getFirstname = function () {
        return _firstname;
    }

    this.setLastname = function (lastname) {
        _lastname = lastname;
    }

    this.getLastname = function () {
        return _lastname;
    }

    this.setMiddleName = function (middleName) {
        _middlename = middleName;
    }

    this.getMiddleName = function () {
        return _middlename;
    }

    this.setMerriedStatus = function (marriedStatus) {
        _isMarried = marriedStatus;
    }

    this.getMerriedStatus = function () {
        return _isMarried;
    }

    this.setGender = function (gender) {
        _gender = gender;
    }

    this.getGender = function () {
        return _gender;
    }

    this.setPosition = function (position) {
        _position = position;
    }

    this.getPosition = function () {
        return _position;
    }
}

DDWAApp.Models.FactoryWorker = function(){
    DDWAApp.Models.Worker.call(this, true);

    var _experience;
    var _salary;

    var parentInitialize = this.initialize; 
    this.initialize = function (data) { 
        parentInitialize.call(this, data);
        _experience = data.experience;
        _salary = data.salary;
    }

    this.setExperience = function (experience) {
        _middleName = middleName;
    }

    this.getExperience = function () {
        return _experience;
    }

    this.setSalary = function (salary) {
        _salary = salary;
    }

    this.getSalary = function () {
        return _salary;
    }
}

DDWAApp.Models.AirdromeWorker = function(){
    DDWAApp.Models.Worker.call(this, false);

    var _numberOfHoursInAir;
    var _oldWorkplaces;

    var parentInitialize = this.initialize;
    this.initialize = function (data) {
        parentInitialize.call(this, data);
        _numberOfHoursInAir = data.numberOfHoursInAir;
        _oldWorkplaces = data.oldWorkplaces;
    }

    this.setNumberOfHoursInAir = function (numberOfHoursInAir) {
        _numberOfHoursInAir = numberOfHoursInAir;
    }

    this.getNumberOfHoursInAir = function () {
        return _numberOfHoursInAir;
    }

    this.setOldWorkplaces = function (oldWorkplaces) {
        _oldWorkplaces = oldWorkplaces;
    }

    this.getOldWorkplaces = function () {
        return _oldWorkplaces;
    }
}

DDWAApp.MakeupManager.ElementsEventsProvider = function () {
    var self = this || {};
    var isUpdateEvent = false;

    self.moveToWorkerDetails = function (id, type) {
        if (isUpdateEvent === true) {
            isUpdateEvent = false;
            return;
        }
        setDisplaySettings('none', 'none', 'inline-table', 'none', 'none');
        DDWAApp.WorkersService.getDetails(id, function(worker){
            DDWAApp.MakeupManager.MakeupCreator.createWorkerDetails(worker);
        });
    };

    self.moveToUpdateWorker = function (id) {
        isUpdateEvent = true;
        setDisplaySettings('none', 'inline-table', 'none', 'none', 'none');
        DDWAApp.WorkersService.getDetails(id, DDWAApp.MakeupManager.MakeupCreator.createWorkerForm);
    }

    self.moveToDeleteWorker = function (id) {
        isUpdateEvent = true;
        DDWAApp.WorkersService.deleteWorker(id, function(data){
            DDWAApp.WorkersService.getAll(function(data){
                DDWAApp.MakeupManager.MakeupCreator.createWorkersTable(data);
            });
        });
    }

    self.moveToCreateWorker = function (isFactoryWorker) {
        setDisplaySettings('none', 'inline-table', 'none', 'none', 'inline-table', isFactoryWorker);
        DDWAApp.MakeupManager.MakeupCreator.createWorkerForm(isFactoryWorker ? new DDWAApp.Models.FactoryWorker() : new DDWAApp.Models.AirdromeWorker(), false);
    }

    self.moveToListWorkers = function () {
        setDisplaySettings('inline-table', 'none', 'none', 'inline-table', 'none');
        DDWAApp.WorkersService.getAll(function(data){
            DDWAApp.MakeupManager.MakeupCreator.createWorkersTable(data);
        });
    };

    self.createWorker = function (event) {
        if (DDWAApp.MakeupManager.WorkersFormValidator.isValidForm(event)) {
            DDWAApp.WorkersService.addWorker(DDWAApp.MakeupManager.FormReader.getDataForm(event), function(){
                DDWAApp.MakeupManager.ElementsEventsProvider.moveToListWorkers();      
            });

        } else {
            if (event.preventDefault) event.preventDefault();
        }
    }

    self.updateWorker = (event, id)=>{
        if (DDWAApp.MakeupManager.WorkersFormValidator.isValidForm(event)) {
            DDWAApp.WorkersService.updateWorker(DDWAApp.MakeupManager.FormReader.getDataForm(event), id, DDWAApp.MakeupManager.ElementsEventsProvider.moveToListWorkers);

        } else {
            if (event.preventDefault) event.preventDefault();
        }
    }

    function setDisplaySettings(listTable, workerForm, detailsTable, createWorkerButton, createButtons, isFactoryWorker) {
        document.getElementById(DDWAApp.CONSTANTS.LIST_PART).style.display = listTable;
        document.getElementById(DDWAApp.CONSTANTS.CREATE_PART).style.display = workerForm;
        document.getElementById(DDWAApp.CONSTANTS.DETAILS_TABLE_ID).style.display = detailsTable;
        document.getElementById(DDWAApp.CONSTANTS.CREATE_WORKER_BUTTON).style.display = createWorkerButton;
        document.getElementById(DDWAApp.CONSTANTS.CREATE_BUTTONS_ID).style.display = createButtons;
        document.getElementById(DDWAApp.CONSTANTS.CREATE_FACTORY_WORKER_BUTTON).classList.value = isFactoryWorker ? 'btn btn-info' : 'btn btn-default';
        document.getElementById(DDWAApp.CONSTANTS.CREATE_AIRDROME_WORKER_BUTTON).classList.value = isFactoryWorker ? 'btn btn-default' : 'btn btn-info';
    }

    return self;
}();

DDWAApp.MakeupManager.MakeupCreator = function () {

    var self = this || {};

    self.createWorkersTable = function (workers) {
        var table = document.getElementById(DDWAApp.CONSTANTS.TABLE_ID);
        clearTable(table);

        for (var i = 0; i < workers.length; i++) {
            var tr = document.createElement("tr");
            tr.setAttribute("onclick", "DDWAApp.MakeupManager.ElementsEventsProvider.moveToWorkerDetails(" + workers[i].getId() + ", " + workers[i].getType() + ");return false;");
            tr.innerHTML = "<td>" + workers[i].getFirstname() + "</td>" +
                "<td>" + workers[i].getLastname() + "</td>" +
                "<td>" + workers[i].getMiddleName() + "</td>" +
                "<td>" + (workers[i].getMerriedStatus() == true ? "Да" : "Нет") + "</td>" +
                "<td>" + workers[i].getGender() + "</td>" +
                "<td>" + workers[i].getPosition() + "</td>" +
                "<td><button class='btn btn-default' onclick='DDWAApp.MakeupManager.ElementsEventsProvider.moveToUpdateWorker(" + workers[i].getId() + ");return false;'>Редактировать</button></td>" +
                "<td><button class='btn btn-danger' onclick = 'DDWAApp.MakeupManager.ElementsEventsProvider.moveToDeleteWorker(" + workers[i].getId() + ");return false;'>Удалить</button></td>";

            table.tBodies[0].appendChild(tr);
        }
    };

    self.createWorkerDetails = function (worker) {
        var table = document.getElementById(DDWAApp.CONSTANTS.DETAILS_TABLE_ID);
        var inner = "<tr><th>Имя</th><td>" + worker.getFirstname() + "</td></tr>" +
            "<tr><th>Фамилия</th><td>" + worker.getLastname() + "</td></tr>" +
            "<tr><th>Отчество</th><td>" + worker.getMiddleName() + "</td></tr>" +
            "<tr><th>Женат/Замужем</th><td>" + (worker.getMerriedStatus() == true ? "Да" : "Нет") + "</td></tr>" +
            "<tr><th>Пол</th><td>" + worker.getGender() + "</td></tr>" +
            "<tr><th>Должность</th><td>" + worker.getPosition() + "</td></tr>";
        if (worker.getType() !== 'true' && worker.getType() !== true) {
            inner += "<tr><th>Количество часов в воздухе</th><td>" + worker.getNumberOfHoursInAir() + "</td></tr>";
            inner += "<tr><th>Старое место работы</th><td>" + worker.getOldWorkplaces() + "</td></tr>";
        } else {
            inner += "<tr><th>Стаж</th><td>" + worker.getExperience() + "</td></tr>";
            inner += "<tr><th>Зарплата</th><td>" + worker.getSalary() + "</td></tr>";
        }

        table.innerHTML = inner;
    };

    self.createWorkerForm = function (worker, isUpdate) {
        var form = document.getElementById(DDWAApp.CONSTANTS.FORM_WORKER_ID);
        var inner = '<div class="form-group">' +
            '<label>Имя</label >' +
            '<label style="color: red; display: none;">Поле не должно быть пустым и количсетво символов не должно превышать 10 символов, поле не должно содержать цифры.</label >' +
            '<input name="firstname" class="form-control" pattern="^[а-яА-ЯёЁa-zA-Z]+$" type="text" value="' + getValueForField(worker.getFirstname()) + '" required maxlength="10"/>' +
            '</div>' +
            '<div class="form-group">' +
            '<label >Фамилия</label >' +
            '<label style="color: red; display: none;">Поле не должно быть пустым, количсетво символов не должно превышать 50 символов, поле не должно содержать цифры.</label >' +
            '<input name= "lastname" class="form-control" pattern="^[а-яА-ЯёЁa-zA-Z]+$" value="' + getValueForField(worker.getLastname()) + '" required maxlength="50"/>' +
            '</div>' +
            '<div class="form-group">' +
            '<label>Отчество</label >' +
            '<label style="color: red; display: none;">Поле не должно быть пустым и количсетво символов не должно превышать 50 символов, поле не должно содержать цифры.</label >' +
            '<input name="middlename" class="form-control" pattern="^[а-яА-ЯёЁa-zA-Z]+$" value="' + getValueForField(worker.getMiddleName()) + '" required maxlength="50"/>' +
            '</div>' +
            '<div class="form-group">' +
            '<label>Пол</label >' +
            '<select class="form-control" name="gender" required>' +
            '<option>М</option>' +
            '<option>Ж</option>' +
            '</select>' +
            '</div>' +
            '<div class="form-group">' +
            '<label>Женат/Замужем</label >' +
            '<input class="form-control" name="isMarried" type="checkbox" ' + (worker.getMerriedStatus() ? 'checked' : '') + ' />' +
            '</div>' +
            '<div class="form-group">' +
            '<label>Должность</label >' +
            '<label style="color: red; display: none;">Поле не должно быть пустым и количсетво символов не должно превышать 50 символов.</label >' +
            '<input class="form-control" name="position" value="' + getValueForField(worker.getPosition()) + '" required maxlength="50"/>' +
            '</div>' +
            '<div class="form-group">' +
            '<input class="form-control" name="type" style="display: none;" value="' + getValueForField(worker.getType()) + '"/>' +
            '</div>';
        if (worker.getType() === 'false' || worker.getType() === false) {
            inner += '<div class="form-group">' +
                '<label>Количество часов в воздухе</label >' +
                '<label style="color: red; display: none;">Поле не должно быть пустым и должно содержать только цифры.</label >' +
                '<input class="form-control" name="numberOfHoursInAir" type="number" value="' + getValueForField(worker.getNumberOfHoursInAir()) + '" required/>' +
                '</div>';
            inner += '<div class="form-group">' +
                '<label>Старое место работы</label >' +
                '<label style="color: red; display: none;">Поле не должно быть пустым.</label >' +
                '<input class="form-control" name="oldWorkplaces" type="text" value="' + getValueForField(worker.getOldWorkplaces()) + '" required/>' +
                '</div>';
        } else {
            inner += '<div class="form-group">' +
                '<label>Стаж</label >' +
                '<label style="color: red; display: none;">Поле не должно быть пустым и должно содержать только цифры.</label >' +
                '<input class="form-control" name="experience" type="number" value="' + getValueForField(worker.getExperience()) + '" required/>' +
                '</div>';
            inner += '<div class="form-group">' +
                '<label>Зарплата</label >' +
                '<label style="color: red; display: none;">Поле не должно быть пустым и должно содержать только цифры.</label >' +
                '<input name="salary" class="form-control" type="number" value="' + getValueForField(worker.getSalary()) + '" required/>' +
                '</div>';
        }
        if (!isUpdate) {
            inner += '<input type="submit" value="Создать"  class="btn btn-default" onclick="DDWAApp.MakeupManager.ElementsEventsProvider.createWorker(this.form);" />';
        } else {
            inner += '<input type="submit" value="Сохранить"  class="btn btn-default" onclick="DDWAApp.MakeupManager.ElementsEventsProvider.updateWorker(this.form, ' + worker.getId() + ');" />';
        }

        form.innerHTML = inner;
    };

    function getValueForField(data) {
        return typeof data == 'undefined' ? '' : data;
    }

    function clearTable(table) {
        table.tBodies[0].innerHTML = "";
    }

    return self;
}();

DDWAApp.MakeupManager.FormReader = function () {
    var self = this || {};

    self.getDataForm = function (form) {
        var type = form["type"].value;
        var data = {};

        if (type == 'false') {
            data = getDataFormAirdromeWorker(form);
        } else {
            data = getDataFormFactoryWorker(form);
        };

        return data;
    };

    function getCommonDataFromForm(form) {
        var body = {
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
        var data = getCommonDataFromForm(form);

        data.experience = form["experience"].value;
        data.salary = form["salary"].value;

        return data;
    };

    function getDataFormAirdromeWorker(form) {
        var data = getCommonDataFromForm(form);

        data.numberOfHoursInAir = form["numberOfHoursInAir"].value;
        data.oldWorkplaces = form["oldWorkplaces"].value;

        return data;
    };

    function convertChackbocxValueToBool(value) {
        return value === "on" ? true : false;
    }

    return self;
}();

DDWAApp.Mappers.FactoryMapper = function () {
    var self = this || {};

    self.mapJSONToWorker = (data)=>{
        var worker;
        if (data.type === true || data.type === 'true') {
            worker = new DDWAApp.Models.FactoryWorker();           
        } else {
            worker = new DDWAApp.Models.AirdromeWorker();
        }
        worker.initialize(data);

        return worker;
    }

    return self;
}();

DDWAApp.MakeupManager.WorkersFormValidator = function () {
    var self = this || {};

    self.isValidForm = function (event) {
        event = (event ? event : window.event);
        var form = event;
        var field;
        var formvalid = true;

        for (var i = 0; i < form.elements.length; i++) {
            field = form.elements[i];
            if (!isInputField(field)) continue;

            if (typeof field.willValidate !== "undefined") {
                if (field.nodeName === "INPUT") {
                    field.setCustomValidity(LegacyValidation(field) ? "" : "error");
                }

                field.checkValidity();
            } else {

                field.validity = field.validity || {};

                field.validity.valid = LegacyValidation(field);
            }

            if (field.validity.valid) {
                field.style.border = "1px solid rgba(0, 0, 0, 0.15)";
                if (field.parentElement.children[1].nodeName !== "INPUT")
                    field.parentElement.children[1].style.display = "none";

            } else {

                field.style.border = "1px solid red";
                field.parentElement.children[1].style.display = "inline-table";

                formvalid = false;
            }

        }

        return formvalid;
    }

    function isInputField(field) {
        return (field.nodeName === "INPUT" || field.nodeName === "TEXTAREA" || field.nodeName !== "SELECT") && field.style.display !== "none" && field.type != "submit";
    }

    function LegacyValidation(field) {

        var
            valid = true,
            val = field.value,
            type = field.getAttribute("type"),
            chkbox = (type === "checkbox" || type === "radio"),
            required = field.getAttribute("required"),
            minlength = field.getAttribute("minlength"),
            maxlength = field.getAttribute("maxlength"),
            pattern = field.getAttribute("pattern");

        if (field.disabled) return valid;

        valid = valid && (!required ||
            (chkbox && field.checked) ||
            (!chkbox && val !== "")
        );

        valid = valid && (chkbox || (
            (!minlength || val.length >= minlength) &&
            (!maxlength || val.length <= maxlength)
        ));

        if (valid && pattern) {
            pattern = new RegExp(pattern);
            valid = pattern.test(val);
        }

        return valid;
    }

    return self;
}();

DDWAApp.WorkersService = function () {
    var self = this || {};

    self.deleteWorker = function (id, success) {
            sendGetMethod('DELETE', '/' + id, success);
    };

    self.getAll = function (success) {
        sendGetMethod('GET', '', function(data){
            var workers = [];

            for(var i=0; i< data.length; i++){
                var worker = DDWAApp.Mappers.FactoryMapper.mapJSONToWorker(data[i]);
                workers.push(worker);
            }
            success(workers);
        });
    };

    self.addWorker = function (data, success) {
        sendPostMethod('POST', DDWAApp.CONSTANTS.SERVICE_URL, data, function (data) {
            success(data);
        });  
    };

    self.updateWorker = function (data, id, success) {
        var xhr = new XMLHttpRequest();
        var body =  JSON.stringify(data);

        xhr.open("PUT", DDWAApp.CONSTANTS.SERVICE_URL + "/" + id, true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onreadystatechange = function () {
            if (xhr.readyState != 4) return;
            success();
        };

        xhr.send(body);
    };

    self.getDetails = function (id, success) {
        sendGetMethod('GET', '/' + id, function(data){
            let worker = DDWAApp.Mappers.FactoryMapper.mapJSONToWorker(data);
            success(worker, true);
        });
    };

    function sendGetMethod(method, params, success) {
            let xhr = new XMLHttpRequest();

            xhr.open(method, DDWAApp.CONSTANTS.SERVICE_URL + params, true);
            xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    
            xhr.send();
            xhr.onreadystatechange = ()=>{
                if (xhr.readyState != 4) return;
                if (xhr.status == 200) {
                    let data = JSON.parse(xhr.responseText);
                    success(data);
                }
            }
    }

    function sendPostMethod(method, url, body, success) {
            let xhr = new XMLHttpRequest();

            xhr.open(method, url, true);
            xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');

            xhr.onreadystatechange = function () {
                if (xhr.readyState != 4) return;
                success(xhr.responseText);
            };

            xhr.send(JSON.stringify(body));
    }

    function createWorker(data) {
        var worker;
        if (data.type === true || data.type === 'true') {
            worker = new DDWAApp.Models.FactoryWorker();
            worker.initialize(data);
        } else {
            worker = new DDWAApp.Models.AirdromeWorker();
            worker.initialize(data);
        }
        return worker;
    }

    return self;
}();

document.addEventListener("DOMContentLoaded", function (event) {
    DDWAApp.WorkersService.getAll(function(data){
        DDWAApp.MakeupManager.MakeupCreator.createWorkersTable(data);
    });
});