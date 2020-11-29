import * as url from '../constant/Url'
import { commonAuthorizedHeader } from '../middlewares/Common';
import { rejectedPromise } from './Promises';
export default class MasterManagementService
{
    static instance = MasterManagementService.instance || new MasterManagementService();
    constructor(){
        this.usersData = null;
        this.departementsData = null;
    }

    static getInstance()
    {
        if(MasterManagementService.instance == null) {
            MasterManagementService.instance = new MasterManagementService();
        }
        return MasterManagementService.instance;
    }
    setUsersData = (usersData) => {
        this.usersData = usersData;
    }
    userList = (filter) => {
        return this.list({
            code: 'user',
            filter: filter
        });
    }
    departementList = (filter) => {
        return this.list({
            code: 'departement',
            filter: filter
        });
    }

    list = (payload) => {
        const request = {
            code: payload.code,
            filter: payload.filter
        }

        const endpoint = url.contextPath().concat("api/masterdata/list");
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