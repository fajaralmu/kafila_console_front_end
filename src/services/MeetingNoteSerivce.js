import * as url from '../constant/Url'
import { commonAuthorizedHeader } from '../middlewares/Common';
import { rejectedPromise, commonAjaxPostCalls } from './Promises';
export default class MeetingNoteSerivce {
    static instance = MeetingNoteSerivce.instance || new MeetingNoteSerivce();

    store = (meetingNote) => {

        const request = {
            meeting_note: meetingNote
        }

        const endpoint = url.contextPath().concat("api/notes/store");
        return commonAjaxPostCalls(endpoint, request);
    }

    view = (id) => {

        const request = {
            code: 'meeting_note'
        }

        const endpoint = url.contextPath().concat("api/notes/view/"+id);
        return commonAjaxPostCalls(endpoint, request);
    }
}