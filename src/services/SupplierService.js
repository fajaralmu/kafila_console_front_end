import * as url from '../constant/Url'
import { commonAuthorizedHeader } from './../middlewares/Common';
export default class SupplierService {
    static instance = SupplierService.instance || new SupplierService()

    getSupplierList = (raw) => {
        const fieldsFilter = {}
        fieldsFilter[raw.key] = raw.value;
        const request = {
            entity: "supplier",
            filter: {
                limit: raw.limit ? raw.limit : 10,
                page: raw.page ? raw.page : 0,
                exacts: raw.exacts == true,
                fieldsFilter: fieldsFilter,
                orderBy: raw.orderby,
                orderType: raw.ordertype
            }
        };
        const endpoint = url.contextPath().concat("api/public/get");
        return new Promise(function (resolve, reject) {
            fetch(endpoint, {
                method: url.POST,
                body: JSON.stringify(request),
                headers: commonAuthorizedHeader()
            })
                .then(response => response.json())
                .then(function (response) {
                    if (response.code == "00" && response.entities.length > 0) 
                    { resolve(response); }
                    else 
                    { reject(response); }
                })
                .catch((e) => { console.error(e); reject(e); });
        })
    }

    getProductSupplied = (supplierId) => {
        const request = { supplier: { id: supplierId } };
        const endpoint = url.contextPath().concat("api/public/productssupplied");

        return new Promise(function (resolve, reject) {
            fetch(endpoint, {
                method: url.POST,
                body: JSON.stringify(request),
                headers: commonAuthorizedHeader()
            })
                .then(response => response.json())
                .then(function (response) {
                    if (response.code == "00") 
                    { resolve(response); } 
                    else 
                    { reject(response); }
                })
                .catch((e) => { console.error(e); reject(e); });
        })
    }
}