import * as url from '../constant/Url'
import { commonAuthorizedHeader } from '../middlewares/Common';
import { commonAjaxPostCalls } from './Promises';
import { contextPath } from './../constant/Url';
export default class RecordHistoriesService {
    static instance = RecordHistoriesService.instance || new RecordHistoriesService();
    getStatistic = () => {
        const request = {}

        const endpoint = contextPath().concat("api/histories/statistic");
        return commonAjaxPostCalls(endpoint, request);
    }

}