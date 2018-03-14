import Logo from '../img/bob_1.jpg';
import Banner from '../img/banner.jpg';
import "babel-polyfill";
import { getAll } from './services/worker-http-service';
import { createWorkersTable, initImages } from './managers/makeup-creating-manager';
import { initMakeupButtonsEvents } from './managers/elements-events-manager';
import {start} from './helpers/web-worker';
import { initValidator } from './validators/workers-from-validator';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery-validation/dist/jquery.validate.min';
import 'datatables.net-bs4/css/dataTables.bootstrap4.css';
import 'tempusdominus-bootstrap-4/build/css/tempusdominus-bootstrap-4.min.css';
import '../css/validator.css';

require('font-awesome/css/font-awesome.css');
require('datatables.net');
require('datatables.net-bs4');
require('tempusdominus-bootstrap-4');

document.addEventListener("DOMContentLoaded", function (event) {
        initMakeupButtonsEvents();
	    getAll().then((data)=>{
        createWorkersTable(data);
        initValidator();
        initImages(Logo, Banner);
       // start();
    });
});