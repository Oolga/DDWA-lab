import FactoryWorker from '../models/factory-worker';
import AirdromeWorker from '../models/airdrome-worker';

export function mapJSONToWorker(data){
    let worker;
    if (data.type === true || data.type === 'true') {
        worker = new FactoryWorker(data);
    } else {
        worker = new AirdromeWorker(data);
    }
    return worker;
}