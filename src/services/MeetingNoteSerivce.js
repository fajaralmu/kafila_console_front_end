import * as url from '../constant/Url'
import { commonAuthorizedHeader } from '../middlewares/Common';
import { rejectedPromise } from './Promises';
export default class MeetingNoteSerivce {
    static instance = MeetingNoteSerivce.instance || new MeetingNoteSerivce();

    store = (meetingNote) => {

        const request = {
            meeting_note: meetingNote
        }

        const endpoint = url.contextPath().concat("api/notes/store");
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