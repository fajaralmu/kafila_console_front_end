
import React, { Component } from 'react';

import { Route, Switch, withRouter, Redirect, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import BaseComponent, { CommonTitle } from '../../BaseComponent';
import MeetingNoteSerivce from '../../../services/MeetingNoteSerivce';
import Message from '../../messages/Message';
import * as formComponent from '../../forms/commons';
import Card from '../../container/Card';
import { SubmitResetButton } from '../../forms/commons';

const FORM_ID = "form-input-meeting-note";
class MeetingNoteForm extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            recordNotFound: false,
            isLoadingRecord: true,
            discussionTopicCount: [1]
        }

        this.form_temporary_inputs = {};
        this.meetingNote = { discussion_topics: [] };
        this.isSubmitting = false;
        this.meetingNoteService = MeetingNoteSerivce.instance;
        this.getRecordId = () => {
            return this.props.match.params.id;
        }

        this.getMaxVal = () => {
            const discussionTopicCount = this.state.discussionTopicCount;
            let max = 0;
            for (let i = 0; i < discussionTopicCount.length; i++) {
                const element = discussionTopicCount[i];
                if (element > max) {
                    max = element;
                }
            }
            return max;
        }

        this.addDiscussionTopic = () => {
            const discussionTopicCount = this.state.discussionTopicCount;
            this.saveFormTemporaryInputs();
            discussionTopicCount.push(this.getMaxVal() + 1);
            this.setState({ discussionTopicCount: discussionTopicCount });

        }

        this.removeDiscussionTopic = (id) => {
            if (!window.confirm("Remove discussion topic (" + id + ")? ")) {
                return;
            }
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

            this.saveFormTemporaryInputs();
            discussionTopicCount.splice(index, 1);
            this.setState({ discussionTopicCount: discussionTopicCount });
            this.setFormTemporaryInputs();

        }
        this.setFormTemporaryInputs = () => {
            console.debug("setTempDiscussionTopicValues");
            const form = document.getElementById(FORM_ID);
            if (null == form) {
                return;
            }
            const inputs = form.getElementsByClassName("input-form-field");
            for (let i = 0; i < inputs.length; i++) {
                const element = inputs[i];
                if (null != this.form_temporary_inputs[element.name]) {
                    element.value = this.form_temporary_inputs[element.name];
                } else {
                    element.value = null;
                }
            }
        }
        this.saveFormTemporaryInputs = () => {
            this.form_temporary_inputs = {};
            const form = document.getElementById(FORM_ID);
            const inputs = form.getElementsByClassName("input-form-field");
            for (let i = 0; i < inputs.length; i++) {
                const element = inputs[i];
                if (element.value == null || element.value == "") {
                    continue;
                }
                this.form_temporary_inputs[element.name] = element.value;
            }
            console.debug("TEMP: ", this.form_temporary_inputs);
        }

        this.onSubmit = (e) => {
            e.preventDefault();
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

        this.extractTopicDiscussionIndexAndName = (elementName) => {
            const result = {
                index: 0,
                name: null,
            }
            let elementNameSplitKey = elementName.split("discussion_topic_");
            let elementNameSplitIndex = elementNameSplitKey[1].split("_");
            result.index = parseInt(elementNameSplitIndex[0]);
            result.name = elementName.split("discussion_topic_" + result.index + "_")[1];
            return result;
        }

        this.fillDataAndStore = (form) => {
            const inputs = form.getElementsByClassName("input-form-field");

            this.meetingNote = {
                discussion_topics: []
            };
            let currentDiscussionTopicID = -1;
            let currentDiscussionTopicIndex = -1;
            for (let i = 0; i < inputs.length; i++) {
                const element = inputs[i];
                const elementName = element.name;
                if (null == element.value || "" == element.value) {
                    continue;
                }
                if (elementName.startsWith("discussion_topic_")) {
                    const indexAndName = this.extractTopicDiscussionIndexAndName(elementName);
                    if (indexAndName.index != currentDiscussionTopicID) {
                        this.meetingNote.discussion_topics.push({});
                        currentDiscussionTopicID = indexAndName.index;
                        currentDiscussionTopicIndex++;
                    }
                    this.meetingNote.discussion_topics[currentDiscussionTopicIndex][indexAndName.name] = element.value;
                } else {
                    this.meetingNote[elementName] = element.value;
                }
            }

            if (this.getRecordId() != null) {
                this.meetingNote.id = this.getRecordId();
            }

            console.debug("inputs size:", inputs.length, "meetingNote>>", this.meetingNote);
            this.storeMeetingNote();

        }

        this.recordSaved = (response) => {
            this.showInfo("SUCCESS");
            try {
                if (this.getRecordId() == null) {
                    this.handleSuccessGetRecord(response);
                    this.props.history.push("/meetingnote/" + response.meeting_note.id);
                }
            } catch (error) { }
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
            this.setState({ discussionTopicCount: discussionTopicCount, isLoadingRecord: false });
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
                        this.form_temporary_inputs["discussion_topic_" + discussion_topic.id + "_" + key] = element;
                    }
                }
            }

        }
        this.enableInputs = () => {
            const form = document.getElementById(FORM_ID);
            const inputs = form.getElementsByClassName("input-form-field");
            for (let i = 0; i < inputs.length; i++) {
                const element = inputs[i];
                element.removeAttribute("disabled");
            }
            if (this.isSubmitting == false) {
                form.reset();
            }
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
        this.isClosed = () => {
            return this.getRecordId() != null && this.meetingNote != null && this.meetingNote.is_closed == true;
        }
    }

    componentWillMount() {
        this.validateLoginStatus();
    }

    componentDidMount() {
        document.title = "Meeting Note Form";
        if (this.getRecordId() != null) {
            this.loadRecord();
        }
    }

    componentDidUpdate() {
        if (this.getRecordId() == null) {
            this.enableInputs();
        }
        this.setFormTemporaryInputs();
    }

    render() {

        if (this.state.recordNotFound) {
            return <Message className="is-danger" body="Record Not Found" />
        }

        if (this.getRecordId() != null && this.state.isLoadingRecord) {
            return <h3>Please Wait...</h3>
        }

        const loggedUser = this.props.loggedUser;
        if (null == loggedUser) {
            return <></>
        }
        return (
            <div>
                <CommonTitle>Notulensi Rapat Departemen {this.props.loggedUser.departement.name}</CommonTitle>
                <Card title="Formulir Notulensi">
                    {this.getRecordId() != null && this.meetingNote != null ?
                        <div className="level"><div className="level-left"></div>
                            <div className="level-right">
                                <span className="tag is-primary is-medium">{this.meetingNote.departement.name}</span>
                            </div>
                        </div>
                        :
                        null}
                    <form id={FORM_ID} onSubmit={this.onSubmit}>
                        <InputField required={true} label="Tanggal" name="date" type="date" />
                        <InputField required={true} label="Tempat" name="place" />
                        <CommonTitle>Tema Pembahasan</CommonTitle>
                        {this.state.discussionTopicCount.map((id, i) => {
                            
                            return (
                                <div className="box" key={"disc_topic_field_" + i}>
                                    <h2>#{i + 1} - id:{id}</h2>
                                    {this.getRecordId() == null && this.state.discussionTopicCount.length > 1 ?
                                        <a className="button is-danger" onClick={(e) => this.removeDiscussionTopic(id)}>
                                            Remove
                                    </a>
                                        : null}
                                    <InputField className="discussion-topic" required={true} label="Pembahasan" name={"discussion_topic_" + id + "_content"} type="textarea" />
                                    <InputField className="discussion-topic" required={true} label="Keputusan" name={"discussion_topic_" + id + "_decision"} type="textarea" />
                                    <InputField className="discussion-topic" required={true} label="Deadline" name={"discussion_topic_" + id + "_deadline_date"} type="date" />
                                    <InputField className="discussion-topic" required={true} label="Penganggung Jawab" name={"discussion_topic_" + id + "_person_in_charge"} />
                                
                                    {this.getRecordId() != null?
                                    <><Link to={"/discussiontopics/"+id} className="button is-warning">
                                        <span className="icon">
                                            <i className="fas fa-edit"></i>
                                        </span>
                                        <span>Edit</span>
                                    </Link>
                                    <Link to={"/discussiontopics/"+id+"/action"} className="button is-info">
                                    <span className="icon">
                                        <i className="fas fa-paper-plane"></i>
                                    </span>
                                    <span>Konfirmasi</span>
                                </Link></>:
                                    null}
                                </div>
                            )
                        })}

                        {this.getRecordId() == null ?
                            <SubmitResetButton submitText={"Create"} withReset={true} />
                            : null
                        }

                    </form>
                    {this.getRecordId() == null ?
                        <div className="has-text-centered">
                            <a className="button is-primary"

                                onClick={this.addDiscussionTopic}
                                style={{ marginTop: '10px', marginBottom: '10px' }}>
                                <span className="icon">
                                    <i className="fas fa-plus"></i>
                                </span>
                                <span>{"Tambah Tema Pembahasan"}</span>
                            </a>
                        </div> : null}
                </Card>
            </div>
        )
    }
}

const InputField = (props) => {

    return formComponent.InputField(props);
}


const mapStateToProps = state => {

    return {
        loggedUser: state.userState.loggedUser,
        loginStatus: state.userState.loginStatus,
    }
}
const mapDispatchToProps = dispatch => ({
    //   getMeetingNotes: (request, app) => dispatch(actions.meetingNotesAction.list(request, app)),
})

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(MeetingNoteForm));