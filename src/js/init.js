import "babel-polyfill";
import Logo from '../img/bob_1.jpg';
import Banner from '../img/banner.jpg';
import { getAll } from './services/worker-http-service';
import { createWorkersTable, initImages  } from './managers/makeup-creating-manager';
import { initMakeupButtonsEvents} from './managers/elements-events-manager';
import {start} from './helpers/web-worker';
//import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
//import '../node_modules/';

document.addEventListener("DOMContentLoaded", function (event) {
      initMakeupButtonsEvents();
	    getAll().then((data)=>{
        createWorkersTable(data);
        initImages(Logo, Banner);
       // start();
    });
});