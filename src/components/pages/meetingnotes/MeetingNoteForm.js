
import React from 'react';

import { withRouter, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import BaseComponent, { mapCommonUserStateToProps } from '../../BaseComponent';
import MeetingNoteSerivce from '../../../services/MeetingNoteSerivce';
import Message from '../../messages/Message';
import Card from '../../container/Card';
import DiscussionTopicsService from './../../../services/DiscussionTopicsService';
import { LabelField, InputField } from './../../forms/commons';
import { getAttachmentData } from './../../../utils/ComponentUtil';
import DiscussionTopicPopupForm from './DiscussionTopicPopupForm';
import {
    deleteArrayValueWithKeyStartedWith, getMaxDiscussionTopicID,
    isDiscussionTopicClosed, extractInputValues, extractMeetingNoteObjectToTempData,
    extractMeetingNoteObject,
    enableAllInputs,
    populateInputs,
    mergeObject,
    getArrayIndexWithValue,
    getDiscussionTopic
} from './logicHelper';
import {
    ButtonRemoveTopic, LinkEditAndAction, ButtonAddTopic,
    FormUpperTag, TOPIC_PREFIX, FormTitle,
    MeetingNoteSubmitResetField, LabelDiscussionTopicCount,
    ClosedInfoTag, AttachmentInfo, DiscussionTopicCommonInputs
} from './componentHelper';
import { AttachmentLink } from '../../buttons/buttons';

const FORM_ID = "form-input-meeting-note";
const CLASS_INPUT_FIELD = "input-form-field";

class MeetingNoteForm extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            recordNotFound: false,
            isLoadingRecord: true,
            discussionTopicCount: [1],
            showFormDiscussionTopicInEditMode: false
        }

        this.discussionTopicService = DiscussionTopicsService.instance;
        this.meetingNoteService = MeetingNoteSerivce.instance;

        this.attachmentsData = {};
        this.form_temporary_inputs = {};
        this.meetingNote = null;//{ discussion_topics: [] };
        this.isSubmitting = false;
        this.getRecordId = () => {
            return this.props.match.params.id;
        }

        this.addDiscussionTopic = () => {
            this.saveFormInputsToTemporaryData();
            if (this.getRecordId() != null && null != this.meetingNote) {
                this.setState({ showFormDiscussionTopicInEditMode: true });
                return;
            }
            const discussionTopicCount = this.state.discussionTopicCount;
            discussionTopicCount.push(getMaxDiscussionTopicID(discussionTopicCount) + 1);
            this.setState({ discussionTopicCount: discussionTopicCount });
        }

        this.removeDiscussionTopic = (id) => {
            this.saveFormInputsToTemporaryData();
            const app = this;
            this.showConfirmationDanger("Remove discussion topic (" + id + ")? ")
                .then(function (ok) {
                    if (ok) 
                        app.doRemoveDiscussionTopic(id);
                });
        }

        this.doRemoveDiscussionTopic = (id) => {
            const discussionTopicCount = this.state.discussionTopicCount;
            let index = getArrayIndexWithValue(discussionTopicCount, id);

            if (null == index) { return; }
            discussionTopicCount.splice(index, 1);

            //delete temp data
            this.deleteTempFormData(id);
            this.setState({ discussionTopicCount: discussionTopicCount });
            this.setInputsFromTemporaryData();

        }
        this.deleteTempFormData = (id) => {
            const prefix = TOPIC_PREFIX + id + "_";
            deleteArrayValueWithKeyStartedWith(this.form_temporary_inputs, prefix);
            deleteArrayValueWithKeyStartedWith(this.attachmentsData, prefix);
        }
        this.setInputsFromTemporaryData = () => {
            const form = document.getElementById(FORM_ID);
            if (null == form) { return; }
            const inputs = form.getElementsByClassName(CLASS_INPUT_FIELD);
            populateInputs(inputs, this.form_temporary_inputs, this.getRecordId() != null);
        }
        this.saveFormInputsToTemporaryData = () => {
            const form = document.getElementById(FORM_ID);
            if (null == form) { return; }
            const inputs = form.getElementsByClassName(CLASS_INPUT_FIELD);
            this.form_temporary_inputs = extractInputValues(inputs);
        }

        this.onSubmit = (e) => {
            e.preventDefault();
            if (this.getRecordId() != null) {
                return;
            }
            this.saveFormInputsToTemporaryData();
            this.isSubmitting = true;
            const app = this;
            const form = e.target;
            this.showConfirmation("Submit Data?").then(function (accepted) {
                if (accepted) 
                    app.fillDataAndStore(form);
                app.isSubmitting = false;
            });
        }

        this.fillDataAndStore = (form) => {
            const rawInputs = this.form_temporary_inputs;
            const inputs = {};
            mergeObject(rawInputs, this.attachmentsData);
            //sort keys
            Object.keys(rawInputs).sort().forEach(function (key) {
                inputs[key] = rawInputs[key];
            });

            this.meetingNote = extractMeetingNoteObject(inputs);
            if (this.getRecordId() != null) {
                this.meetingNote.id = this.getRecordId();
            }
            console.debug("inputs: ", inputs, "meetingNote: ", this.meetingNote);
            this.storeMeetingNote();

        }
        this.addAttachmentData = (e, key) => {
            this.saveFormInputsToTemporaryData();
            const app = this;
            const form = e.target;
            getAttachmentData(form).then(function (data) {
                app.attachmentsData[key] = data;
                app.refresh();
            });
        }
        this.removeAttachment = (key) => {
            this.saveFormInputsToTemporaryData();
            const app = this;
            this.showConfirmation("Remove attachment?").then(function (ok) {
                if (!ok) return;
                try {
                    delete app.attachmentsData[key];
                    app.refresh();
                } catch (error) { console.error(error) }
            });
        }
        this.recordSaved = (response) => {
            this.showInfo("Success");
            try {
                if (this.getRecordId() == null) {
                    this.props.history.push("/meetingnote/" + response.meeting_note.id);
                    this.handleSuccessGetRecord(response);
                }
            } catch (error) { console.error(error); }
        }

        this.handleErrorGetRecord = (error) => {
            console.error(error);
            this.setState({ recordNotFound: true })
        }

        this.handleSuccessGetRecord = (response) => {
            this.meetingNote = response.meeting_note;
            const discussionTopics = this.meetingNote.discussion_topics;
            let discussionTopicCount = [];
            for (let i = 0; i < discussionTopics.length; i++) {
                const element = discussionTopics[i];
                discussionTopicCount.push(element.id);
            }
            this.form_temporary_inputs = extractMeetingNoteObjectToTempData(this.meetingNote);
            this.setState({ discussionTopicCount: discussionTopicCount, isLoadingRecord: false });
        }
        this.enableInputs = () => {
            const form = document.getElementById(FORM_ID);
            if (null == form) { return; }
            enableAllInputs(form.getElementsByClassName(CLASS_INPUT_FIELD));
            if (this.isSubmitting == false) { form.reset(); }
        }

        this.discussionTopicSaved = (response) => {
            this.setState({ showFormDiscussionTopicInEditMode: false });
            this.loadRecord();
        }

        // ajax calls
        this.storeMeetingNote = () => {
            this.commonAjax(this.meetingNoteService.store, this.meetingNote,
                this.recordSaved, null);
        }
        this.loadRecord = () => {
            this.commonAjax(this.meetingNoteService.view, this.getRecordId(),
                this.handleSuccessGetRecord, this.handleErrorGetRecord);
        }
    }

    componentWillMount() {
        this.validateLoginStatus();
    }

    componentDidMount() {
        document.title = "Notulensi";
        if (this.getRecordId() != null) {
            this.loadRecord();
        }
    }

    componentDidUpdate() {
        this.validateLoginStatus();
        if (this.getRecordId() == null) {
            this.enableInputs();
        }

        if (this.getRecordId() == null && this.meetingNote != null) {
            this.meetingNote = null;
            this.form_temporary_inputs = {};           
            this.setState({ discussionTopicCount: [1] });
        }
        this.setInputsFromTemporaryData();
    }

    getUserName() {
        if (this.meetingNote != null && this.meetingNote.user != null) {
            return this.meetingNote.user.display_name;
        }
        return this.getLoggedUser().display_name;
    }

    render() {
        if (this.isLoggedUserNull()) {
            return null;
        }

        const title = this.title("Notulensi Rapat");
        if (this.state.recordNotFound) {
            return <div>{title}<Message className="is-danger" body="Record Not Found" /></div>
        }
        if (this.getRecordId() != null && this.state.isLoadingRecord) {
            return <div>{title}<h3>Please Wait...</h3></div>
        }
        const discussionTopicCount = this.state.discussionTopicCount;
        return (
            <div>
                {title}
                <DiscussionTopicPopupForm show={this.state.showFormDiscussionTopicInEditMode}
                    app={this.props.app} meetingNote={this.meetingNote} onSuccess={this.discussionTopicSaved}
                    onClose={(e) => this.setState({ showFormDiscussionTopicInEditMode: false })} />

                <form id={FORM_ID} onSubmit={this.onSubmit}>
                    <Card title={<FormTitle />}>
                        <FormUpperTag show={this.getRecordId() != null} meetingNote={this.meetingNote} />
                        <InputField required={true} label="Tanggal" name="date" type="date" />
                        <InputField required={true} label="Tempat" name="place" />
                        <LabelDiscussionTopicCount count={this.state.discussionTopicCount.length} />
                        <LabelField label="Notulis" >{this.getUserName()}</LabelField>
                    </Card>

                    {/* ---------- discussion topics forms ----------- */}
                    {discussionTopicCount.map((id, i) => {
                        const isClosed = isDiscussionTopicClosed(this.meetingNote, id);
                        const discussionTopic = getDiscussionTopic(this.meetingNote, id);
                        const title = "Tema Pembahasan #" + (i + 1);// +", id:"+id;
                        const inputPrefix = TOPIC_PREFIX + id;
                        return (
                            <Card title={title} key={"discussion_topic_field_" + i}>
                                <ClosedInfoTag show={this.getRecordId()!=null} closed={isClosed} />
                                <ButtonRemoveTopic show={this.getRecordId() == null && this.state.discussionTopicCount.length > 1} id={id} removeDiscussionTopic={this.removeDiscussionTopic} />
                                <DiscussionTopicCommonInputs inputPrefix={inputPrefix} />
                                <InputField show={this.getRecordId() == null} className="discussion-topic" label="Attachment" attributes={{ onChange: (e) => this.addAttachmentData(e, inputPrefix + "_attachment") }}
                                    name={inputPrefix + "_attachment"} type="file" note="Kosongkan jika tidak ada dokumen" />
                                <AttachmentInfo show={this.attachmentsData[inputPrefix + "_attachment"] != null}
                                    name={this.attachmentsData[inputPrefix + "_attachment"] == null ? null : this.attachmentsData[inputPrefix + "_attachment"].name}
                                    onRemoveClick={(e) => this.removeAttachment(inputPrefix + "_attachment")} />
                                <LinkEditAndAction show={this.getRecordId() != null} id={id} />
                                <AttachmentLink showExtension={true} show={discussionTopic!=null&&discussionTopic.attachment!=null} 
                                    to={discussionTopic==null?null:"upload/topic/"+discussionTopic.attachment} />
                            </Card>
                        )
                    })}
                    <ButtonAddTopic addDiscussionTopic={this.addDiscussionTopic} />
                    <MeetingNoteSubmitResetField show={this.getRecordId() == null} />
                </form>
            </div>
        )
    }
}

export default withRouter(connect(
    mapCommonUserStateToProps,
)(MeetingNoteForm));