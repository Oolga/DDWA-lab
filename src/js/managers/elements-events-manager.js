import { getDetails, getAll, deleteWorker, addWorker, updateWorker } from '../services/worker-http-service';
import { getDataForm } from '../managers/form-reading-manager';
import { createWorkerDetails, createWorkersTable, createWorkerForm } from '../managers/makeup-creating-manager';
import { isValidForm } from '../validators/workers-from-validator';
import FactoryWorker from '../models/factory-worker';
import AirdromeWorker from '../models/airdrome-worker';
import { searchByValue } from '../helpers/search-helper';
import { setSourtByHeaders } from '../helpers/sort-helper'
import * as CONSTANTS from '../constants';

let isUpdateEvent = false;

export function initMakeupButtonsEvents(){
    let moveToListButton = document.getElementById(CONSTANTS.MOVE_TO_LIST_BUTTON);
    moveToListButton.onclick = function(){
        moveToListWorkers(); 
        return false;
    };

    let searchButton = document.getElementById(CONSTANTS.SEARCH_BUTTON);
    searchButton.onclick = function(){
        searchByValue();
        return false;
    }

    let createButton = document.getElementById(CONSTANTS.CREATE_WORKER_BUTTON);
    createButton.onclick = function(){
        moveToCreateWorker(true);
        return false;
    }
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
            createWorkersTable(data);
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
        createWorkersTable(data);
    });
};

export function createWorkerClick(event){
    if (isValidForm(event)) {
        addWorker(getDataForm(event)).then(function(data){
            moveToListWorkers();                
        });
    } else {
        if (event.preventDefault) event.preventDefault();
    }
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
    document.getElementById(CONSTANTS.LIST_PART).style.display = listTable;
    document.getElementById(CONSTANTS.CREATE_PART).style.display = workerForm;
    document.getElementById(CONSTANTS.DETAILS_TABLE_ID).style.display = detailsTable;
    document.getElementById(CONSTANTS.CREATE_WORKER_BUTTON).style.display = createWorkerButton;
    document.getElementById(CONSTANTS.CREATE_BUTTONS_ID).style.display = createButtons;
    document.getElementById(CONSTANTS.CREATE_FACTORY_WORKER_BUTTON).classList.value = isFactoryWorker ? 'btn btn-info' : 'btn btn-default';
    document.getElementById(CONSTANTS.CREATE_AIRDROME_WORKER_BUTTON).classList.value = isFactoryWorker ? 'btn btn-default' : 'btn btn-info';
    document.getElementById(CONSTANTS.SEARCH_SECTION_ID).style.display = searchSection;
}