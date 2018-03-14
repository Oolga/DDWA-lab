import { getAll } from '../services/worker-http-service';
import { createWorkersTable } from '../managers/makeup-creating-manager';
import * as CONSTANTS from '../constants';

export async  function searchByValue(){
    let searchData = $('#'+CONSTANTS.SEARCH_INPUT_ID).value;
    let data = await getAll();
        let workers = data.filter(item=>{
            if(item.getFirstname.includes(searchData) || item.getLastname.includes(searchData) || item.getMiddleName.includes(searchData)  )
                return true;
        });
    createWorkersTable(workers);
};
