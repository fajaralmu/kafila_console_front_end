
import React from 'react';

import { withRouter, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import BaseComponent from '../../BaseComponent';
import MeetingNoteSerivce from '../../../services/MeetingNoteSerivce';
import Message from '../../messages/Message';
import Card from '../../container/Card';
import DiscussionTopicsService from './../../../services/DiscussionTopicsService';
import { LabelField, SubmitResetButton, InputField } from './../../forms/commons';
import { getAttachmentData } from './../../../utils/ComponentUtil';
import DiscussionTopicPopupForm from './DiscussionTopicPopupForm';
import { ButtonRemoveTopic, LinkEditAndAction, ButtonAddTopic, FormUpperTag, extractTopicDiscussionIndexAndName, TOPIC_PREFIX, deleteArrayValueWithKeyStartedWith, getMaxDiscussionTopicID, isDiscussionTopicClosed, FormTitle, MeetingNoteSubmitResetField, LabelDiscussionTopicCount, ClosedInfoTag, AttachmentInfo } from './helper';

const FORM_ID = "form-input-meeting-note";
const CLASS_INPUT_FIELD = "input-form-field";

class MeetingNoteForm extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            recordNotFound: false,
            isLoadingRecord: true,
            discussionTopicCount: [1],
            showFormDiscussionTopicInEditMode: false
        }

        this.discussionTopicService = DiscussionTopicsService.instance;

        this.attachmentsData = {};
        this.form_temporary_inputs = {};
        this.meetingNote = { discussion_topics: [] };
        this.isSubmitting = false;
        this.meetingNoteService = MeetingNoteSerivce.instance;
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
                    if (ok) {
                        app.doRemoveDiscussionTopic(id);
                    }
                })
        }

        this.doRemoveDiscussionTopic = (id) => {

            const discussionTopicCount = this.state.discussionTopicCount;
            let index = null;

            for (let i = 0; i < discussionTopicCount.length; i++) {
                const element = discussionTopicCount[i];
                if (element == id) {
                    index = i;
                    break;
                }

            }
            if (null == index) {
                return;
            }
            discussionTopicCount.splice(index, 1);

            //delete temp data
            this.deleteTempFormData(id);
            this.setState({ discussionTopicCount: discussionTopicCount });
            this.setInputsFromTemporaryData();

        }
        this.deleteTempFormData = (id) => {
            deleteArrayValueWithKeyStartedWith(
                this.form_temporary_inputs, TOPIC_PREFIX + id + "_"
            )
            deleteArrayValueWithKeyStartedWith(
                this.attachmentsData, TOPIC_PREFIX + id + "_"
            )
        }
        this.setInputsFromTemporaryData = () => {
            console.debug("setTempDiscussionTopicValues: ", this.form_temporary_inputs);
            // console.debug("attachmentData: ", this.attachmentsData);
            const form = document.getElementById(FORM_ID);
            if (null == form) {
                return;
            }
            const inputs = form.getElementsByClassName(CLASS_INPUT_FIELD);
            for (let i = 0; i < inputs.length; i++) {
                const element = inputs[i];
                if (element.type == 'file') continue;
                if (null != this.form_temporary_inputs[element.name]) {
                    element.value = this.form_temporary_inputs[element.name];
                } else {
                    element.value = null;
                }

                if (this.getRecordId() != null) {
                    element.setAttribute("disabled", "disabled");
                }
            }
        }
        this.saveFormInputsToTemporaryData = () => {
            this.form_temporary_inputs = {};
            const form = document.getElementById(FORM_ID), app = this;
            const inputs = form.getElementsByClassName(CLASS_INPUT_FIELD);
            for (let i = 0; i < inputs.length; i++) {
                const element = inputs[i];
                const name = element.name;
                if (element.value == null || element.value == "") {
                    continue;
                }
                if (element.type == 'file') {
                    //
                } else {
                    this.form_temporary_inputs[name] = element.value;
                }
            }
            console.debug("SAVED TEMP: ", this.form_temporary_inputs);
        }

        this.onSubmit = (e) => {
            e.preventDefault();
            if (this.getRecordId() != null) {
                return;
            }
            this.saveFormInputsToTemporaryData();
            this.isSubmitting = true;
            const form = e.target;
            const app = this;
            this.showConfirmation("Submit Data?").then(function (accepted) {
                if (accepted) {
                    app.fillDataAndStore(form);
                }
                app.isSubmitting = false;
            });
        }

        this.fillDataAndStore = (form) => {
            const rawInputs = this.form_temporary_inputs;
            for (const key in this.attachmentsData) {
                if (this.attachmentsData.hasOwnProperty(key)) {
                    const element = this.attachmentsData[key];
                    rawInputs[key] = element;
                }
            }
            const inputs = {};
            //sort keys
            Object.keys(rawInputs).sort().forEach(function (key) {
                inputs[key] = rawInputs[key];
            });
            console.debug("inputs: ", inputs);
            this.meetingNote = { discussion_topics: [] };
            let currentDiscussionTopicID = -1;
            let currentDiscussionTopicIndex = -1;
            for (const key in inputs) {
                const value = inputs[key];
                if (key.startsWith(TOPIC_PREFIX)) {
                    const indexAndName = extractTopicDiscussionIndexAndName(key);
                    if (indexAndName.index != currentDiscussionTopicID) {
                        this.meetingNote.discussion_topics.push({});
                        currentDiscussionTopicID = indexAndName.index;
                        currentDiscussionTopicIndex++;
                    }
                    if (value.isFile == true) {
                        this.meetingNote.discussion_topics[currentDiscussionTopicIndex][indexAndName.name + "_info"] = value;
                    } else {
                        this.meetingNote.discussion_topics[currentDiscussionTopicIndex][indexAndName.name] = value;
                    }
                } else {
                    this.meetingNote[key] = value;
                }
            }

            if (this.getRecordId() != null) {
                this.meetingNote.id = this.getRecordId();
            }

            console.debug("meetingNote: ", this.meetingNote);
            this.storeMeetingNote();

        }
        this.addAttachmentData = (e, key) => {
            this.saveFormInputsToTemporaryData();
            const app = this;
            getAttachmentData(e.target).then(function (data) {
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
        this.handleErrorSubmit = (error) => {
            this.showError("handleErrorSubmit: " + error);
        }
        this.handleErrorGetRecord = (error) => {
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
            this.form_temporary_inputs = {};

            for (const key in this.meetingNote) {
                if (this.meetingNote.hasOwnProperty(key)) {
                    const element = this.meetingNote[key];
                    if (key == ("discussion_topics")) {
                        continue;
                    }
                    this.form_temporary_inputs[key] = element;
                }
            }
            for (let i = 0; i < this.meetingNote.discussion_topics.length; i++) {
                const discussion_topic = this.meetingNote.discussion_topics[i];
                for (const key in discussion_topic) {
                    if (discussion_topic.hasOwnProperty(key)) {
                        const element = discussion_topic[key];
                        this.form_temporary_inputs[TOPIC_PREFIX + discussion_topic.id + "_" + key] = element;
                    }
                }
            }
            this.setState({ discussionTopicCount: discussionTopicCount, isLoadingRecord: false });
        }
        this.enableInputs = () => {
            const form = document.getElementById(FORM_ID);
            if (null == form) { return; }
            const inputs = form.getElementsByClassName(CLASS_INPUT_FIELD);
            for (let i = 0; i < inputs.length; i++) {
                const element = inputs[i];
                element.removeAttribute("disabled");
            }
            if (this.isSubmitting == false) { form.reset(); }
        }

        this.discussionTopicSaved = (response) => {
            // alert("Success");
            this.setState({ showFormDiscussionTopicInEditMode: false });
            this.loadRecord();
        }

        // ajax calls
        this.storeMeetingNote = () => {
            this.commonAjax(this.meetingNoteService.store, this.meetingNote,
                this.recordSaved, this.handleErrorSubmit);
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

    getUserName(){
        if (this.meetingNote != null && this.meetingNote.user != null) {
            return this.meetingNote.user.display_name;
        } else {
            return this.getLoggedUser().display_name;
        }
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
                    {this.state.discussionTopicCount.map((id, i) => {
                        const isClosed = isDiscussionTopicClosed(this.meetingNote, id);
                        const title = "Tema Pembahasan #" + (i + 1);// +", id:"+id;
                        const inputPrefix = TOPIC_PREFIX + id;
                        return (
                            <Card title={title} key={"disc_topic_field_" + i}>
                                <ClosedInfoTag closed={isClosed} />
                                <ButtonRemoveTopic show={this.getRecordId() == null && this.state.discussionTopicCount.length > 1} id={id} removeDiscussionTopic={this.removeDiscussionTopic} />
                                <InputField className="discussion-topic" required={true} label="Pembahasan" name={inputPrefix + "_content"} type="textarea" />
                                <InputField className="discussion-topic" required={true} label="Keputusan" name={inputPrefix + "_decision"} type="textarea" />
                                <InputField className="discussion-topic" required={true} label="Deadline" name={inputPrefix + "_deadline_date"} type="date" />
                                <InputField className="discussion-topic" required={true} label="Penganggung Jawab" name={inputPrefix + "_person_in_charge"} />
                                
                                <InputField show={this.getRecordId() == null} className="discussion-topic" label="Attachment" attributes={{ onChange: (e) => this.addAttachmentData(e, inputPrefix + "_attachment") }}
                                    name={inputPrefix + "_attachment"} type="file" note="Kosongkan jika tidak ada dokumen" />
                                <AttachmentInfo show={this.attachmentsData[inputPrefix + "_attachment"]!=null}
                                    name={this.attachmentsData[inputPrefix + "_attachment"]==null?null:this.attachmentsData[inputPrefix + "_attachment"].name}
                                    onRemoveClick={(e) => this.removeAttachment(inputPrefix + "_attachment")} />

                                <LinkEditAndAction show={this.getRecordId() != null} id={id} />
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

const mapStateToProps = state => {
    return {
        loggedUser: state.userState.loggedUser,
        loginStatus: state.userState.loginStatus,
    }
}
export default withRouter(connect(
    mapStateToProps,
)(MeetingNoteForm));