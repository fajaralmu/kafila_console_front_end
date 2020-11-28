import * as url from '../constant/Url'
import { commonAuthorizedHeader } from '../middlewares/Common';
export default class TransactionHistoryService {
    static instance = TransactionHistoryService.instance || new TransactionHistoryService()

    getTransactionData = function (transactionCode) {
        const endpoint = url.contextPath().concat("api/transaction/transactiondata/" + transactionCode)
        return new Promise(function (resolve, reject) {
            fetch(endpoint, {
                method: url.POST,
                headers: commonAuthorizedHeader()
            })
                .then(response => response.json()).then(function (response) {
                    if (response.code == "00") 
                    { resolve(response);  } 
                    else 
                    { reject(response) }
                }).
                catch((e) => reject(e));
        })

    }

    getInventoriesQuantity = function (request) {
        const endpoint = url.contextPath().concat("api/transaction/inventoriesquantity")
        return new Promise(function (resolve, reject) {
            fetch(endpoint, {
                method: url.POST,
                headers: commonAuthorizedHeader()
            })
                .then(response => response.json()).then(function (response) {
                    if (response.code == "00") 
                    { resolve(response);  } 
                    else 
                    { reject(response) }
                }).
                catch((e) => reject(e));
        })

    }

    getBalanceInfo = (request) => {
        const endpoint = url.contextPath().concat("api/admin/balance")
        return new Promise(function (resolve, reject) {
            fetch(endpoint, {
                method: url.POST,
                headers: commonAuthorizedHeader(),
                body: JSON.stringify(request),
            })
                .then(response => response.json()).then(function (response) {
                    if (response.code == "00") 
                    { resolve(response);  } 
                    else 
                    { reject(response) }
                }).
                catch((e) => reject(e));
        })
    }
}