import "babel-polyfill";
import { getAll } from './services/worker-http-service';
import { createWorkersTable } from './managers/makeup-creating-manager';
import { initMakeupButtonsEvents } from './managers/elements-events-manager';
import {start} from './helpers/web-worker';
//import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
//import '../node_modules/';

document.addEventListener("DOMContentLoaded", function (event) {
      initMakeupButtonsEvents();
	    getAll().then((data)=>{
        createWorkersTable(data);
       // start();
    });
});