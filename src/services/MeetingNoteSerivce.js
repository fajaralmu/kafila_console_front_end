import * as url from '../constant/Url'
import { commonAuthorizedHeader } from '../middlewares/Common';
import { commonAjaxPostCalls } from './Promises';
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
        const endpoint = url.contextPath().concat("api/notes/view/"+id);
        return commonAjaxPostCalls(endpoint, {});
    }

    storeAction = (action) => {

        const request = {
            action: action
        }

        const endpoint = url.contextPath().concat("api/action/store");
        return commonAjaxPostCalls(endpoint, request);
    }
}