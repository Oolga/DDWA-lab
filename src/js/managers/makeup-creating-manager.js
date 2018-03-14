import {WorkerIterator} from '../helpers/worker-iterator';
import {moveToWorkerDetails, moveToUpdateWorker, moveToDeleteWorker, moveToListWorkers, createWorkerClick, updateWorkerClick, initTableHendlers} from './elements-events-manager';
import { sortBy } from '../helpers/sort-helper';
import { setImage } from '../helpers/image-helper';
import * as CONSTANTS from '../constants';

let table; 

export function initImages(logo, banner){
    setImage($('#logo'), logo, {height: 100, width: 150});
    setImage($('#banner'), banner, {height: 100, width: 900});
}

export function createWorkersTable(workers){
    table = $(CONSTANTS.TABLE_ID).dataTable({
        'ajax' : {
            url: CONSTANTS.SERVICE_URL,
            dataSrc: ''
        },
        'columns': [
            { data: 'firstname' },
            { data: 'lastname' },
            { data: 'middlename' },
            { data: 'isMarried' },
            { data: 'gender' },
            { data: 'position' },
            {
                data: 'id',
                render: (id, type, full) => `<button class="deleteWorkerBtn btn btn-danger" value="${id}">Delete</button>`
            },
            {
                data: 'id',
                render: (id, type, full) => `<button class="detailsWorkerBtn btn btn-primary" value="${id}">Info</button>`
            },
            {
                data: 'id',
                render: (id, type, full) => `<button class="editWorkerBtn btn btn-info" value="${id}">Edit</button>`
            }
        ],
        initComplete: function() {
            this.api().columns().every(function() {
                var column = this;
                var select = $('<select><option value=""></option></select>')
                    .appendTo($(column.footer()).empty())
                    .on('change', function() {
                        var val = $.fn.dataTable.util.escapeRegex(
                            $(this).val()
                        );

                        column
                            .search(val ? '^' + val + '$' : '', true, false)
                            .draw();
                    });

                column.data().unique().sort().each(function(d, j) {
                    select.append('<option value="' + d + '">' + d + '</option>')
                });
            });
        }
    });
    
        table.on('draw.dt', function() {
            initTableHendlers();
           // PageFunction.SetHandler();
        });
	};

export function createWorkerDetails(worker){
        let table = $('#'+CONSTANTS.DETAILS_TABLE_ID);
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
                        <tr><th>Зарплата</th><td>${worker.getSalary}</td></tr>
                        <tr><th>Дата начала работы</th><td>${worker.getStartDate}</td></tr>`;
        }

        table.html(inner);
    };

export function createWorkerForm(worker, isUpdate){
        let form = $('#'+CONSTANTS.FORM_WORKER_ID);
        let button;
        let inner = `<div class="form-group">
            <label>Имя</label >
            <input name="firstname" class="form-control"  type="text" value="${getValueForField(worker.getFirstname)}" />
            </div>
            <div class="form-group">
            <label >Фамилия</label >
            <input name= "lastname" class="form-control" value="${getValueForField(worker.getLastname)}"/>
            </div>
            <div class="form-group">
            <label>Отчество</label >
            <input name="middlename" class="form-control" value="${getValueForField(worker.getMiddleName)}"/>
            </div>
            <div class="form-group">
            <label>Пол</label >
            <select class="form-control" name="gender">
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
            <input class="form-control" name="position" value="${getValueForField(worker.getPosition)}"/>
            </div>
            <div class="form-group">
            <input class="form-control" name="type" style="display: none;" value="${getValueForField(worker.getType)}"/>
            </div>`;
        if (worker.getType === 'false' || worker.getType === false) {
            inner += `<div class="form-group">
                <label>Количество часов в воздухе</label >
                <label style="color: red; display: none;">Поле не должно быть пустым и должно содержать только цифры.</label >
                <input class="form-control" name="numberOfHoursInAir" type="number" value="${getValueForField(worker.getNumberOfHoursInAir)}"/>
                </div>
                <div class="form-group">
                <label>Старое место работы</label >
                <label style="color: red; display: none;">Поле не должно быть пустым.</label >
                <input class="form-control" name="oldWorkplaces" type="text" value="${getValueForField(worker.getOldWorkplaces)}" />
                </div>`;
        } else {
            inner += `<div class="form-group">
                <label>Стаж</label >
                <label style="color: red; display: none;">Поле не должно быть пустым и должно содержать только цифры.</label >
                <input class="form-control" name="experience" type="number" value="${getValueForField(worker.getExperience)}" />
                </div>
                <div class="form-group">
                <label>Зарплата</label >
                <label style="color: red; display: none;">Поле не должно быть пустым и должно содержать только цифры.</label >
                <input name="salary" class="form-control" type="number" value="${getValueForField(worker.getSalary)}" />
                </div>
                <div class="form-group">
                        <label for="startDate">Дата принятия на работу</label>
                    <div class="input-group date" id="datetimepicker4" data-target-input="nearest">
                    <div class="input-group-append" data-target="#datetimepicker4" data-toggle="datetimepicker">
                        <div class="input-group-text">
                        <span class="input-group-addon">
                             <span class="glyphicon glyphicon-calendar"></span>
                        </span>
                        </div>
                        </div>
                        <input type="text" id="startDate" name="startDate" class="form-control datetimepicker-input date" data-target="#datetimepicker4" style="width: 90%" value="${getValueForField(worker.getStartDate)}" />
                     
                    </div>
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
        form.html(inner);
        form.append(button);

        if (worker.getType !== 'false' || worker.getType !== false) {
             $('#datetimepicker4').datetimepicker({
                format: 'L'
            });
        }
};

export function reloadTable(){
    table.dataTable().api().ajax.reload();
}

export function setSourtByHeaders(table, array){
    for(let i =0 ; i< table.tHead.rows[0].cells.length-2; i++)
    {
        let cellsName = table.tHead.rows[0].cells[i].getAttribute('data-name');
        table.tHead.rows[0].cells[i].onclick = function(){
            debugger;
            let sortedArray = sortBy(array, cellsName);
            createWorkersTable(sortedArray);
        };
    }
}

function createSubmit(value, onclick){
    let submit = $('input');
    submit.attr('type', 'submit');
    submit.attr('class', "btn btn-default");
    submit.attr('name', value);
    submit.val(value);

    return submit;
}

function createButton(value, onclick, classAttr){
    let button = $('button');
    button.attr('class',classAttr);
    button.attr('name', value);
    button.val(value);
   // button.click(onclick);

    return button;
}

function getValueForField(data) {
    return typeof data == 'undefined' ? '' : data;
}
function clearTable(table) {
    table.tBodies[0].innerHTML = "";
}