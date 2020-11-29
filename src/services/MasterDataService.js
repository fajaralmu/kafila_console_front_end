import * as url from '../constant/Url'
import { commonAuthorizedHeader } from '../middlewares/Common';
import { rejectedPromise, commonAjaxPostCalls } from './Promises';
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

    storeUser = (user) => {
        const request = {
            code: 'user',
            userModel:user
        }

        const endpoint = url.contextPath().concat("api/masterdata/store");
        return commonAjaxPostCalls(endpoint, request);
    }

    viewUser = (id) => {
        const endpoint = url.contextPath().concat("api/masterdata/view/"+id);
        return commonAjaxPostCalls(endpoint, {code:"user"});
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
        return commonAjaxPostCalls(endpoint, request);
    }
}