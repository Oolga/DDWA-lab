import { getDetails, getAll, deleteWorker, addWorker, updateWorker } from '../services/worker-http-service';
import { getDataForm } from '../managers/form-reading-manager';
import { createWorkerDetails, createWorkersTable, createWorkerForm, reloadTable } from '../managers/makeup-creating-manager';
import { isValidForm } from '../validators/workers-from-validator';
import FactoryWorker from '../models/factory-worker';
import AirdromeWorker from '../models/airdrome-worker';
import { searchByValue } from '../helpers/search-helper';
import { setSourtByHeaders } from '../helpers/sort-helper'
import * as CONSTANTS from '../constants';

let isUpdateEvent = false;

export function initMakeupButtonsEvents(){
    $('#'+CONSTANTS.MOVE_TO_LIST_BUTTON).click(function(){
        moveToListWorkers(); 
        return false;
    });
}

export function initTableHendlers(){
        $('#'+CONSTANTS.CREATE_WORKER_BUTTON).click(function () {
            moveToCreateWorker(true);
        });
        $('.detailsWorkerBtn').click(function (event) {
            moveToWorkerDetails(event.currentTarget.value);
        });
        $('.deleteWorkerBtn').click(function (event) {
             moveToDeleteWorker(event.currentTarget.value);
        });
        $('.editWorkerBtn').click(function (event) {
            moveToUpdateWorker(event.currentTarget.value);
        });
}

export function moveToWorkerDetails(id, type){
    if (isUpdateEvent === true) {
        isUpdateEvent = false;
        return;
    }
    setDisplaySettings('none', 'none', 'inline-table', 'none', 'none', 'none');
    getDetails(id).then((worker)=>{
        createWorkerDetails(worker);
    });
};

export function moveToUpdateWorker(id){
    isUpdateEvent = true;
    setDisplaySettings('none', 'inline-table', 'none', 'none', 'none', 'none');
    getDetails(id).then((worker)=>{
        createWorkerForm(worker, true);
    });
}

export function moveToDeleteWorker(id){
    isUpdateEvent = true;
    deleteWorker(id).then(function(data){
        getAll().then((data)=>{
            reloadTable();
        });
    });
}

export function moveToCreateWorker(isFactoryWorker){
    setDisplaySettings('none', 'inline-table', 'none', 'none', 'inline-table', 'none', isFactoryWorker);
    createWorkerForm(isFactoryWorker ? new FactoryWorker({}) : new AirdromeWorker({}), false);
}

export function moveToListWorkers(){
    setDisplaySettings('inline-table', 'none', 'none', 'inline-table', 'none', 'flex');
    getAll().then((data)=>{
        reloadTable();
    });
};

export function createWorkerClick(event){
   // if (isValidForm(event)) {
        addWorker(getDataForm(event)).then(function(data){
            moveToListWorkers();                
        });
   /* } else {
        if (event.preventDefault) event.preventDefault();
    }*/
}

export function updateWorkerClick(event, id){
    if (isValidForm(event)) {
        updateWorker(getDataForm(event), id).then(()=>{
            moveToListWorkers();
        });

    } else {
        if (event.preventDefault) event.preventDefault();
    }
}

function setDisplaySettings(listTable, workerForm, detailsTable, createWorkerButton, createButtons, searchSection, isFactoryWorker) {
    $('#'+CONSTANTS.LIST_PART).css('display',listTable);
    $('#'+CONSTANTS.CREATE_PART).css('display',workerForm);
    $('#'+CONSTANTS.DETAILS_TABLE_ID).css('display', detailsTable);
    $('#'+CONSTANTS.CREATE_WORKER_BUTTON).css('display', createWorkerButton);
    $('#'+CONSTANTS.CREATE_BUTTONS_ID).css('display', createButtons);
    $('#'+CONSTANTS.CREATE_FACTORY_WORKER_BUTTON).addClass(isFactoryWorker ? 'btn btn-info' : 'btn btn-default');
    $('#'+CONSTANTS.CREATE_AIRDROME_WORKER_BUTTON).addClass(isFactoryWorker ? 'btn btn-default' : 'btn btn-info');
   // document.getElementById(CONSTANTS.SEARCH_SECTION_ID).style.display = searchSection;
}