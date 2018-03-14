import {mapJSONToWorker} from '../mappers/factory-mapper';
import {WorkerIterator} from '../helpers/worker-iterator';
import * as CONSTANTS from '../constants';

export async function deleteWorker(id){
        let data = sendGetMethod('DELETE', '/' + id);
        return data;
};

export async function getAll(){
        let data = await sendGetMethod('GET', '');
                let workers = [];
                WorkerIterator.workers = data; 

                for(let item of WorkerIterator[Symbol.iterator]()){
                    let worker = mapJSONToWorker(item);
                    workers.push(worker);
                }
        return workers;
};

export async function addWorker(data){
        let result = await sendPostMethod('POST', CONSTANTS.SERVICE_URL, data);
        return result;
};

export async function updateWorker(data, id){
        let result = await sendPostMethod('PUT', CONSTANTS.SERVICE_URL +"/"+id, data);
        return result;
};

export async function getDetails(id){
        let data = await sendGetMethod('GET', '/' + id);
        let worker = mapJSONToWorker(data);
        return worker;
};

async function sendGetMethod(method, params) {
    let options= {
        method: method,
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        }
    };

    let response = await fetch(CONSTANTS.SERVICE_URL + params, options);
    let data = await response.json();

    return data;
}

async function sendPostMethod(method, url, body) {
    let options = {
        method: method,
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(body)
    };

    let result = await fetch(url, options);
    let data = await result.json();

    return data;
}