import {WorkerIterator} from '../helpers/worker-iterator';
import {moveToWorkerDetails, moveToUpdateWorker, moveToDeleteWorker, moveToListWorkers, createWorkerClick, updateWorkerClick} from './elements-events-manager';
import { sortBy } from '../helpers/sort-helper';
import { setImage } from '../helpers/image-helper';
import * as CONSTANTS from '../constants';


export function initImages(logo, banner){
    setImage(document.getElementById('logo'), logo, {height: 100, width: 150});
    setImage(document.getElementById('banner'), banner, {height: 100, width: 900});
}
export function createWorkersTable(workers){
        let table = document.getElementById(CONSTANTS.TABLE_ID);
        setSourtByHeaders(table, workers);
        clearTable(table);
        WorkerIterator.workers = workers;

        for(let worker of WorkerIterator[Symbol.iterator]()){
            let tr = document.createElement('tr');
            tr.onclick = function(){
                moveToWorkerDetails(worker.getId,worker.getType);
                return false;
            };
            tr.innerHTML = `<td>${worker.getFirstname}</td>
                            <td>${worker.getLastname}</td>
                            <td>${worker.getMiddleName}</td>
                            <td>${(worker.getMerriedStatus == true ? "Да" : "Нет")}</td>
                            <td>${worker.getGender}</td>
                            <td>${worker.getPosition}</td>`;
            let tdEdit = document.createElement('td');
            let buttonEdit = createButton('Редактировать', function(){
                moveToUpdateWorker(worker.getId);
                return false;
            },'btn btn-default');
            tdEdit.appendChild(buttonEdit);

            let tdDelete = document.createElement('td');
            let buttonDelete = createButton('Удалить', function(){
                moveToDeleteWorker(worker.getId);
                return false;
            },'btn btn-danger');
            tdDelete.appendChild(buttonDelete);

            tr.appendChild(tdEdit);
            tr.appendChild(tdDelete);

            table.tBodies[0].appendChild(tr);
        }
	};

export function createWorkerDetails(worker){
        let table = document.getElementById(CONSTANTS.DETAILS_TABLE_ID);
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

export function createWorkerForm(worker, isUpdate){
        let form = document.getElementById(CONSTANTS.FORM_WORKER_ID);
        let button;
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
            button = createSubmit("Создать", function(){
                createWorkerClick(this.form);
            });
        } else {
            button = createSubmit("Сохранить", function(){
                updateWorkerClick(this.form, worker.getId);
            });
        }
        form.innerHTML = inner;
        form.appendChild(button);
};

export function setSourtByHeaders(table, array){
    for(let i =0 ; i< table.tHead.rows[0].cells.length-2; i++)
    {
        let cellsName = table.tHead.rows[0].cells[i].getAttribute('data-name');
        console.log(cellsName);
        table.tHead.rows[0].cells[i].onclick = function(){
            debugger;
            let sortedArray = sortBy(array, cellsName);
            console.log(sortedArray);
            createWorkersTable(sortedArray);
        };
    }
}

function createSubmit(value, onclick){
    let submit = document.createElement('input');
    submit.setAttribute('type', 'submit');
    submit.setAttribute('class', "btn btn-default");
    submit.value = value;
    submit.onclick = onclick;

    return submit;
}

function createButton(value, onclick, classAttr){
    let button = document.createElement('button');
    button.setAttribute('class',classAttr);
    button.innerText = value;
    button.onclick = onclick;

    return button;
}

function getValueForField(data) {
    return typeof data == 'undefined' ? '' : data;
}
function clearTable(table) {
    table.tBodies[0].innerHTML = "";
}