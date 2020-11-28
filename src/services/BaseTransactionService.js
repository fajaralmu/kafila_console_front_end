import * as url from '../constant/Url'
import { commonAuthorizedHeader } from '../middlewares/Common';
import { emptyPromise } from './Promises'; 

export default class BaseTransactionService {

    getProductList = (raw) => {
        if( raw.value == null || raw.value.toString().trim() == ""){
            return emptyPromise({entities:[]});
        }
        const fieldsFilter = {};
        fieldsFilter[raw.key] = raw.value;
        const request = {
            entity: "product", 
            filter: { 
                page: 0, 
                exacts: (raw.exacts == true), 
                limit: 15, 
                fieldsFilter: fieldsFilter 
            }
        }
        const endpoint = url.contextPath().concat("api/entity/get")
        return new Promise(function (resolve, reject) {
            fetch(endpoint, {
                method: url.POST,
                headers: commonAuthorizedHeader(),
                body: JSON.stringify(request),
            })
                .then(response => response.json()).then(function (response) {
                    if (response.code == "00") 
                    { resolve(response) } 
                    else 
                    { reject(response) }
                }).
                catch((e) => reject(e));
        })
    }

    submitTransactionSelling = (request) => this.submitTransaction({...request, type:'SELLING' })
    submitTransactionPurchasing = (request) => this.submitTransaction({...request, type:'PURCHASING' })

    submitTransaction = (raw) => {
        console.debug("submitTransaction ", raw.type);
        const type = raw.type;
        const request = {
            productFlows: raw.productFlows
        }
        return new Promise(function (resolve, reject) {
            let endpoint;
            switch (type) {
                case "SELLING":
                    if(null == raw.customer){
                        reject("Invalid Customer");
                        break;
                    }
                    request.customer = raw.customer;
                    endpoint = url.contextPath().concat("api/transaction/selling")
                    break;
                case "PURCHASING": 
                default:
                    if(null == raw.supplier){
                        reject("Invalid Supplier");
                        break;
                    }
                    request.supplier = raw.supplier;
                    endpoint = url.contextPath().concat("api/transaction/purchasing")
                    break;
            } 
            fetch(endpoint, {
                method: url.POST,
                headers: commonAuthorizedHeader(),
                body: JSON.stringify(request),
            })
                .then(response => response.json()).then(function (response) {
                    if (response.code == "00") 
                    { resolve(response) } 
                    else 
                    { reject(response) }
                }).
                catch((e) => reject(e));
        })
    }
}