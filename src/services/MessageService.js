import * as url from '../constant/Url'
import { commonAuthorizedHeader } from './../middlewares/Common';
import { rejectedPromise } from './Promises';
export default class MessageService {
    static instance = MessageService.instance || new MessageService();

    sendChatMessage = (raw) => {

        const request = {
            username: raw.username,
            value: raw.message
        }

        if(raw.message == null || raw.message.toString().trim() == ""){
            return rejectedPromise("Message cannot be empty!");
        }

        const endpoint = url.contextPath().concat("api/admin/sendmessage");
        return new Promise(function (resolve, reject) {
            fetch(endpoint, {
                method: url.POST,
                body: JSON.stringify(request),
                headers: commonAuthorizedHeader()
            })
            .then(response => response.json())
            .then(function (response) {
                if (response.message == "success") 
                { resolve(response); }
                else 
                { reject(response); }
            })
            .catch((e) => { console.error(e); reject(e); });
        })
    }
}