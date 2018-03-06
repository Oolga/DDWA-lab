'use strict';

let DDWAApp = (function () {
	return {
		Models: {
			Worker: {},
			FactoryWorker: {},
			AirdromeWorker: {}
        },
        Mappers: {
            MapperFactory: {}
        },
        Helpers:{
            WorkerIterator:{},
            SearchHelper: {},
            WebWorker: {}
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
            CREATE_BUTTONS_ID: 'createButtons',
            SEARCH_INPUT_ID: 'searchInput',
            SEARCH_SECTION_ID: "searchSection"
		}
	};
})();

DDWAApp.Models.Worker = class {

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

DDWAApp.Models.FactoryWorker = class extends DDWAApp.Models.Worker {
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

DDWAApp.Models.AirdromeWorker = class extends DDWAApp.Models.Worker {
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
DDWAApp.MakeupManager.ElementsEventsProvider = function(){
    let self = this || {};
    let isUpdateEvent = false;

    self.moveToWorkerDetails = (id, type)=>{
        if (isUpdateEvent === true) {
            isUpdateEvent = false;
            return;
        }
        setDisplaySettings('none', 'none', 'inline-table', 'none', 'none', 'none');
		DDWAApp.WorkersService.getDetails(id).then((worker)=>{
            DDWAApp.MakeupManager.MakeupCreator.createWorkerDetails(worker);
        });
    };

    self.moveToUpdateWorker = (id)=>{
        isUpdateEvent = true;
        setDisplaySettings('none', 'inline-table', 'none', 'none', 'none', 'none');
        DDWAApp.WorkersService.getDetails(id).then((worker)=>{
            DDWAApp.MakeupManager.MakeupCreator.createWorkerForm(worker, true);
        });
    }

    self.moveToDeleteWorker = (id)=>{
        isUpdateEvent = true;
        DDWAApp.WorkersService.deleteWorker(id).then(function(data){
            DDWAApp.WorkersService.getAll().then((data)=>{
                DDWAApp.MakeupManager.MakeupCreator.createWorkersTable(data);
            });
        });
    }

    self.moveToCreateWorker = (isFactoryWorker)=>{
        setDisplaySettings('none', 'inline-table', 'none', 'none', 'inline-table', 'none', isFactoryWorker);
        DDWAApp.MakeupManager.MakeupCreator.createWorkerForm(isFactoryWorker ? new DDWAApp.Models.FactoryWorker({}) : new DDWAApp.Models.AirdromeWorker({}), false);
    }

    self.moveToListWorkers = ()=>{
        setDisplaySettings('inline-table', 'none', 'none', 'inline-table', 'none', 'flex');
        DDWAApp.WorkersService.getAll().then((data)=>{
            DDWAApp.MakeupManager.MakeupCreator.createWorkersTable(data);
        });
    };

    self.createWorker = (event)=>{
        if (DDWAApp.MakeupManager.WorkersFormValidator.isValidForm(event)) {
            DDWAApp.WorkersService.addWorker(DDWAApp.MakeupManager.FormReader.getDataForm(event)).then(function(data){
                DDWAApp.MakeupManager.ElementsEventsProvider.moveToListWorkers();                
            });
        } else {
            if (event.preventDefault) event.preventDefault();
        }
    }

    self.updateWorker = (event, id)=>{
        if (DDWAApp.MakeupManager.WorkersFormValidator.isValidForm(event)) {
            DDWAApp.WorkersService.updateWorker(DDWAApp.MakeupManager.FormReader.getDataForm(event), id).then(()=>{
                DDWAApp.MakeupManager.ElementsEventsProvider.moveToListWorkers();
            });

        } else {
            if (event.preventDefault) event.preventDefault();
        }
    }

    function setDisplaySettings(listTable, workerForm, detailsTable, createWorkerButton, createButtons, searchSection, isFactoryWorker) {
        document.getElementById(DDWAApp.CONSTANTS.LIST_PART).style.display = listTable;
        document.getElementById(DDWAApp.CONSTANTS.CREATE_PART).style.display = workerForm;
        document.getElementById(DDWAApp.CONSTANTS.DETAILS_TABLE_ID).style.display = detailsTable;
        document.getElementById(DDWAApp.CONSTANTS.CREATE_WORKER_BUTTON).style.display = createWorkerButton;
        document.getElementById(DDWAApp.CONSTANTS.CREATE_BUTTONS_ID).style.display = createButtons;
        document.getElementById(DDWAApp.CONSTANTS.CREATE_FACTORY_WORKER_BUTTON).classList.value = isFactoryWorker ? 'btn btn-info' : 'btn btn-default';
        document.getElementById(DDWAApp.CONSTANTS.CREATE_AIRDROME_WORKER_BUTTON).classList.value = isFactoryWorker ? 'btn btn-default' : 'btn btn-info';
        document.getElementById(DDWAApp.CONSTANTS.SEARCH_SECTION_ID).style.display = searchSection;
    }

	return self;
}();

DDWAApp.MakeupManager.MakeupCreator = function () {

	let self = this || {};

	self.createWorkersTable = (workers)=>{
        let table = document.getElementById(DDWAApp.CONSTANTS.TABLE_ID);
        clearTable(table);
        DDWAApp.Helpers.WorkerIterator.workers = workers;
        
        let iterator = DDWAApp.Helpers.WorkerIterator[Symbol.iterator]();

        for(let worker of DDWAApp.Helpers.WorkerIterator[Symbol.iterator]()){
            let tr = document.createElement('tr');
            tr.setAttribute('onclick', `DDWAApp.MakeupManager.ElementsEventsProvider.moveToWorkerDetails(${worker.getId},${worker.getType});return false;`);
            tr.innerHTML = `<td>${worker.getFirstname}</td>
                            <td>${worker.getLastname}</td>
                            <td>${worker.getMiddleName}</td>
                            <td>${(worker.getMerriedStatus == true ? "Да" : "Нет")}</td>
                            <td>${worker.getGender}</td>
                            <td>${worker.getPosition}</td>
                            <td><button class='btn btn-default' onclick='DDWAApp.MakeupManager.ElementsEventsProvider.moveToUpdateWorker(${worker.getId});return false;'>Редактировать</button></td>
                            <td><button class='btn btn-danger' onclick = 'DDWAApp.MakeupManager.ElementsEventsProvider.moveToDeleteWorker(${worker.getId});return false;'>Удалить</button></td>`;

            table.tBodies[0].appendChild(tr);
        }
	};

	self.createWorkerDetails = (worker)=>{
        let table = document.getElementById(DDWAApp.CONSTANTS.DETAILS_TABLE_ID);
        let inner = `<tr><th>Имя</th><td>${worker.getFirstname}</td></tr>
            <tr><th>Фамилия</th><td>${ worker.getLastname}</td></tr>
            <tr><th>Отчество</th><td>${worker.getMiddleName}</td></tr>
            <tr><th>Женат/Замужем</th><td>${(worker.getMerriedStatus == true ? "Да" : "Нет")}</td></tr>
            <tr><th>Пол</th><td>${worker.getGender}</td></tr>
            <tr><th>Должность</th><td>${worker.getPosition}</td></tr>`;
        if (worker.getType!== 'true' && worker.getType !== true) {
            inner += `<tr><th>Количество часов в воздухе</th><td>${worker.getNumberOfHoursInAir}</td></tr>
                        <tr><th>Старое место работы</th><td>${worker.getOldWorkplaces}</td></tr>`;
        } else {
            inner += `<tr><th>Стаж</th><td>${worker.getExperience}</td></tr>
                        <tr><th>Зарплата</th><td>${worker.getSalary}</td></tr>`;
        }

        table.innerHTML = inner;
    };

    self.createWorkerForm = (worker, isUpdate)=>{
        let form = document.getElementById(DDWAApp.CONSTANTS.FORM_WORKER_ID);
        let inner = `<div class="form-group">
            <label>Имя</label >
            <label style="color: red; display: none;">Поле не должно быть пустым и количсетво символов не должно превышать 10 символов, поле не должно содержать цифры.</label >
            <input name="firstname" class="form-control" pattern="^[а-яА-ЯёЁa-zA-Z]+$" type="text" value="${getValueForField(worker.getFirstname)}" required maxlength="10"/>
            </div>
            <div class="form-group">
            <label >Фамилия</label >
            <label style="color: red; display: none;">Поле не должно быть пустым, количсетво символов не должно превышать 50 символов, поле не должно содержать цифры.</label >
            <input name= "lastname" class="form-control" pattern="^[а-яА-ЯёЁa-zA-Z]+$" value="${getValueForField(worker.getLastname)}" required maxlength="50"/>
            </div>
            <div class="form-group">
            <label>Отчество</label >
            <label style="color: red; display: none;">Поле не должно быть пустым и количсетво символов не должно превышать 50 символов, поле не должно содержать цифры.</label >
            <input name="middlename" class="form-control" pattern="^[а-яА-ЯёЁa-zA-Z]+$" value="${getValueForField(worker.getMiddleName)}" required maxlength="50"/>
            </div>
            <div class="form-group">
            <label>Пол</label >
            <select class="form-control" name="gender" required>
            <option>М</option>
            <option>Ж</option>
            </select>
            </div>
            <div class="form-group">
            <label>Женат/Замужем</label >
            <input class="form-control" name="isMarried" type="checkbox"${(worker.getMerriedStatus ? 'checked': '')} />
            </div>
            <div class="form-group">
            <label>Должность</label >
            <label style="color: red; display: none;">Поле не должно быть пустым и количсетво символов не должно превышать 50 символов.</label >
            <input class="form-control" name="position" value="${getValueForField(worker.getPosition)}" required maxlength="50"/>
            </div>
            <div class="form-group">
            <input class="form-control" name="type" style="display: none;" value="${getValueForField(worker.getType)}"/>
            </div>`;
        if (worker.getType === 'false' || worker.getType === false) {
            inner += `<div class="form-group">
                <label>Количество часов в воздухе</label >
                <label style="color: red; display: none;">Поле не должно быть пустым и должно содержать только цифры.</label >
                <input class="form-control" name="numberOfHoursInAir" type="number" value="${getValueForField(worker.getNumberOfHoursInAir)}" required/>
                </div>
                <div class="form-group">
                <label>Старое место работы</label >
                <label style="color: red; display: none;">Поле не должно быть пустым.</label >
                <input class="form-control" name="oldWorkplaces" type="text" value="${getValueForField(worker.getOldWorkplaces)}" required/>
                </div>`;
        } else {
            inner += `<div class="form-group">
                <label>Стаж</label >
                <label style="color: red; display: none;">Поле не должно быть пустым и должно содержать только цифры.</label >
                <input class="form-control" name="experience" type="number" value="${getValueForField(worker.getExperience)}" required/>
                </div>
                <div class="form-group">
                <label>Зарплата</label >
                <label style="color: red; display: none;">Поле не должно быть пустым и должно содержать только цифры.</label >
                <input name="salary" class="form-control" type="number" value="${getValueForField(worker.getSalary)}" required/>
                </div>`;
        }
        if (!isUpdate) {
            inner += `<input type="submit" value="Создать"  class="btn btn-default" onclick="DDWAApp.MakeupManager.ElementsEventsProvider.createWorker(this.form);" />`;
        } else {
            inner += `<input type="submit" value="Сохранить"  class="btn btn-default" onclick="DDWAApp.MakeupManager.ElementsEventsProvider.updateWorker(this.form,${worker.getId});" />`;
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
	let self = this || {};

	self.getDataForm = (form)=>{
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
		data.startWorkDate = form["salary"].value;

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

	return self;
}();

DDWAApp.MakeupManager.WorkersFormValidator = function() {
    let self = this || {};

    self.isValidForm = (event)=>{
        event = (event ? event : window.event);
        let form = event;
        let field;
        let formvalid = true;

        for (let i = 0; i < form.elements.length; i++) {
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

        let
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
} ();

DDWAApp.Mappers.FactoryMapper = function () {
    let self = this || {};

    self.mapJSONToWorker = (data)=>{
        let worker;
        if (data.type === true || data.type === 'true') {
            worker = new DDWAApp.Models.FactoryWorker(data);
        } else {
            worker = new DDWAApp.Models.AirdromeWorker(data);
        }
        return worker;
    }

    return self;
}();

DDWAApp.Helpers.WebWorker = function (){
    let self = this || {};
    
    self.worker= {};

    
    self.worker = new Worker('./web-worker.js');

    self.worker.addEventListener('message', function(e) {
        debugger;
        document.getElementById('count').textContent = e.data;
        localStorage.setItem('DDWAApp_last_update_time', new Date());
        localStorage.setItem('DDWAApp_last_update_value', e.data);
    }, false);

    self.start = ()=>{
        debugger;
        let lastUpdateDate = localStorage.getItem('DDWAApp_last_update_time')? new Date(localStorage.getItem('DDWAApp_last_update_time')) : new Date();
        let nextUpdateDate =  new Date(lastUpdateDate);
        nextUpdateDate.setMinutes(lastUpdateDate.getMinutes() + (localStorage.getItem('DDWAApp_last_update_time')? 1: 0));

        document.getElementById('count').innerText = ('' + localStorage.getItem('DDWAApp_last_update_value')) || '';

        if (new Date() >= nextUpdateDate) {
            startUpdate();
        } else {
            setTimeout(startUpdate, getNextTimeStart(lastUpdateDate));
        }
    };

    function getNextTimeStart(datetime){
        debugger;
        let nextUpdate =  new Date(datetime);
        nextUpdate.setMinutes(datetime.getMinutes() + 1);

        return nextUpdate - new Date();
    }
    function startUpdate(){
       self. worker.postMessage({'cmd': 'start'});
    }

    return self;
}();


DDWAApp.Helpers.WorkerIterator = {
    workers: [],
    [Symbol.iterator]() {
        return this;
    },
    next() {
        if (this.current === undefined) {
            this.current = 0
        } else {
            this.current++;
        }
        if (this.current < this.workers.length) {
            return {
                done: false,
                value: this.workers[this.current]
            };
        } else {
            delete this.current;
            return {
                done: true
            };
        }
    }
};

DDWAApp.Helpers.SearchHelper = function(){
    let self = this || {};

    self.searchByValue = ()=>{
        let searchData = document.getElementById(DDWAApp.CONSTANTS.SEARCH_INPUT_ID).value;
        DDWAApp.WorkersService.getAll().then((data)=>{
            let workers = data.filter(item=>{
                if(item.getFirstname.includes(searchData) || item.getLastname.includes(searchData) || item.getMiddleName.includes(searchData)  )
                    return true;
            });

            DDWAApp.MakeupManager.MakeupCreator.createWorkersTable(workers);
        });
    };

    return self;
}();

DDWAApp.WorkersService = function () {
    let self = this || {};
    
	self.deleteWorker = async function (id) {
        let data = await sendGetMethod('DELETE', '/' + id);
        return data;
	};

	self.getAll = async function () {
            let data = await sendGetMethod('GET', '');
                    let workers = [];
                    DDWAApp.Helpers.WorkerIterator.workers = data; 

                    for(let item of DDWAApp.Helpers.WorkerIterator[Symbol.iterator]()){
                        let worker = DDWAApp.Mappers.FactoryMapper.mapJSONToWorker(item);
                        workers.push(worker);
                    }
                    return workers;
	};

	self.addWorker = async (data)=>{
            let result = await sendPostMethod('POST', DDWAApp.CONSTANTS.SERVICE_URL, data);
            return result;
	};

	self.updateWorker = async (data, id)=>{
            let result = await sendPostMethod('PUT', DDWAApp.CONSTANTS.SERVICE_URL +"/"+id, data)
            return result;
	};
	
	self.getDetails = async (id)=>{
            let data = await sendGetMethod('GET', '/' + id);
            let worker = DDWAApp.Mappers.FactoryMapper.mapJSONToWorker(data);
            return worker;
    };

    function sendGetMethod(method, params) {
        return new Promise((resolve, reject)=>{
            let xhr = new XMLHttpRequest();

            xhr.open(method, DDWAApp.CONSTANTS.SERVICE_URL + params, true);
            xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    
            xhr.send();
            xhr.onreadystatechange = ()=>{
                if (xhr.readyState != 4) return;
                if (xhr.status == 200) {
                    let data = JSON.parse(xhr.responseText);
                    resolve(data);
                }
            }
        });
    }

    function sendPostMethod(method, url, body) {
        return new Promise((resolve, reject)=>{
            let xhr = new XMLHttpRequest();

            xhr.open(method, url, true);
            xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');

            xhr.onreadystatechange = function () {
                if (xhr.readyState != 4) return;
                resolve(xhr.responseText);
            };

            xhr.send(JSON.stringify(body));
        });
    }

	return self;
}();

document.addEventListener("DOMContentLoaded", function (event) {
	DDWAApp.WorkersService.getAll().then((data)=>{
        DDWAApp.MakeupManager.MakeupCreator.createWorkersTable(data);
        DDWAApp.Helpers.WebWorker.start();
    });
});