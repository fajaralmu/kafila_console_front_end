import * as url from '../constant/Url'
import { commonAuthorizedHeader } from './../middlewares/Common';
export default class CatalogService {
    static instance = CatalogService.instance || new CatalogService()

    /**
     * 
     * @param {JSON} raw 
     */
    getProductList = (raw) => {
         
        const fieldsFilter = {
            withStock: raw.withStock == true,
            withSupplier: raw.withSupplier == true,
            withCategories: raw.withCategories == true,
            ... raw.fieldsFilter
        }
        if (raw.key) {
            fieldsFilter[raw.key] = raw.value;
        } else {
            fieldsFilter['name'] = raw.name;
        } 
        const request = {
            entity: "product",
            filter: {
                exacts: raw.exacts == true,
                limit: raw.limit ? raw.limit : 10,
                page: raw.page ? raw.page : 0,
                fieldsFilter: fieldsFilter,
                orderBy: raw.orderby,
                orderType: raw.ordertype
            }
        }
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

    /**
     * 
     * @param {String} code 
     */
    getProductDetail = (code) => this.getProductList({
        key: 'code',
        value: code,
        limit: 1,
        exacts: true,
        withStock: true,
        withSupplier: true
    })

    /**
     * 
     * @param {JSON} req 
     */
    getMoreSupplier = (req) => { 

        const request = {
            filter: {
                page: req.page,
                fieldsFilter: { productId: req.productId }
            }
        }
        const endpoint = url.contextPath().concat("api/public/moresupplier");
        return new Promise(function (resolve, reject) {
            fetch(endpoint, {
                method: url.POST,
                body: JSON.stringify(request),
                headers: commonAuthorizedHeader()
            })
            .then(response => response.json())
            .then(function (response) {
                if (response.code == "00" && response.entities.length > 0) {
                    resolve(response);
                } else {
                    reject(response);
                }
            })
            .catch((e) => { console.error(e); reject(e); });
        })
    }


}