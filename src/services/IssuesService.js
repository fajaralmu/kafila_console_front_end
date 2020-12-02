
import { contextPath } from './../constant/Url';
import { commonAjaxPostCalls } from './Promises';

export default class IssuesService
{
    static instance = IssuesService.instance || new IssuesService();

    constructor() {

    }

    list = (filter) => {
        const request = {
            code: 'issue',
            filter: filter
        }

        const endpoint = contextPath().concat("api/issues/list");
        return commonAjaxPostCalls(endpoint, request);
    }
    delete = (id) => {
        const endpoint = contextPath().concat("api/issues/delete/"+id);
        return commonAjaxPostCalls(endpoint, {});
    }
}