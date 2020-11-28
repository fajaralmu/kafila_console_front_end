import * as url from '../constant/Url'
import { commonAuthorizedHeader } from './../middlewares/Common';
import BaseTransactionService from './BaseTransactionService';
export default class TransactionPurchasingService extends BaseTransactionService{
    static instance = TransactionPurchasingService.instance || new  TransactionPurchasingService();
 

}