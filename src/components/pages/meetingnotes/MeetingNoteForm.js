
import React, { Component } from 'react';

import { Route, Switch, withRouter, Redirect, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import BaseComponent, { CommonTitle } from '../../BaseComponent';
import MeetingNoteSerivce from '../../../services/MeetingNoteSerivce';
import Message from '../../messages/Message';
import * as formComponent from '../../forms/commons';
import Card from '../../container/Card';
import { SubmitResetButton } from '../../forms/commons';
import { ModalBackdrop } from './../../messages/Alert';
import DiscussionTopicsService from './../../../services/DiscussionTopicsService';
import { LabelField } from './../../forms/commons';

const FORM_ID = "form-input-meeting-note";
const TOPIC_PREFIX = "discussion_topic_";
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

        this.form_temporary_inputs = {};
        this.meetingNote = { discussion_topics: [] };
        this.isSubmitting = false;
        this.meetingNoteService = MeetingNoteSerivce.instance;
        this.getRecordId = () => {
            return this.props.match.params.id;
        }

        this.getMaxDiscussionTopicID = () => {
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

            if (this.getRecordId() != null && null != this.meetingNote) {
                this.setState({ showFormDiscussionTopicInEditMode: true });
                return;
            }

            const discussionTopicCount = this.state.discussionTopicCount;
            this.saveFormTemporaryInputs();
            discussionTopicCount.push(this.getMaxDiscussionTopicID() + 1);
            this.setState({ discussionTopicCount: discussionTopicCount });

        }

        this.isDiscussionTopicClosed = (id) => {
            if (null == this.meetingNote || null == this.meetingNote.discussion_topics) {
                return false;
            }
            for (let i = 0; i < this.meetingNote.discussion_topics.length; i++) {
                const element = this.meetingNote.discussion_topics[i];
                if (element.id == id && element.is_closed) {
                    return true;
                }
            }
            return false;
        }

        this.removeDiscussionTopic = (id) => {
            this.saveFormTemporaryInputs();
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
            this.setState({ discussionTopicCount: discussionTopicCount });
            this.setFormTemporaryInputs();

        }
        this.setFormTemporaryInputs = () => {
            console.debug("setTempDiscussionTopicValues: ", this.form_temporary_inputs);
            const form = document.getElementById(FORM_ID);
            if (null == form) {
                return;
            }
            const inputs = form.getElementsByClassName(CLASS_INPUT_FIELD);
            for (let i = 0; i < inputs.length; i++) {
                const element = inputs[i];
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
        this.saveFormTemporaryInputs = () => {
            this.form_temporary_inputs = {};
            const form = document.getElementById(FORM_ID);
            const inputs = form.getElementsByClassName(CLASS_INPUT_FIELD);
            for (let i = 0; i < inputs.length; i++) {
                const element = inputs[i];
                if (element.value == null || element.value == "") {
                    continue;
                }
                this.form_temporary_inputs[element.name] = element.value;
            }
            console.debug("SAVED TEMP: ", this.form_temporary_inputs);
        }

        this.onSubmit = (e) => {
            e.preventDefault();
            if (this.getRecordId() != null) {
                return;
            }
            this.saveFormTemporaryInputs();
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

        this.onSubmitDiscussionTopic = (e) => {
            e.preventDefault();
            const form = e.target;

            if (!window.confirm("Submit Data?") || null == this.meetingNote) {
                return;
            }
            const inputs = form.getElementsByClassName(CLASS_INPUT_FIELD);
            const discussionTopic = {
                note_id: this.meetingNote.id
            };
            for (let i = 0; i < inputs.length; i++) {
                const element = inputs[i];
                discussionTopic[element.name] = element.value;
            }
            console.debug("SUBMIT:", discussionTopic);
            this.storeDiscussionTopic(discussionTopic);
        }

        this.fillDataAndStore = (form) => {
            const inputs = form.getElementsByClassName(CLASS_INPUT_FIELD);

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
                if (elementName.startsWith(TOPIC_PREFIX)) {
                    const indexAndName = extractTopicDiscussionIndexAndName(elementName);
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

            console.debug("meetingNote: ", this.meetingNote);
            this.storeMeetingNote();

        }

        this.recordSaved = (response) => {
            this.showInfo("SUCCESS");
            try {
                if (this.getRecordId() == null) {
                    
                    this.props.history.push("/meetingnote/" + response.meeting_note.id);
                    this.handleSuccessGetRecord(response);
                }
            } catch (error) {
                console.error(error);
             }
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
            // console.debug("FORM INPUTS: ", this.form_temporary_inputs);
            this.setState({ discussionTopicCount: discussionTopicCount, isLoadingRecord: false });
            
            // console.debug("FORM INPUTS == : ", this.form_temporary_inputs);
        }
        this.enableInputs = () => {
            const form = document.getElementById(FORM_ID);
            const inputs = form.getElementsByClassName(CLASS_INPUT_FIELD);
            for (let i = 0; i < inputs.length; i++) {
                const element = inputs[i];
                element.removeAttribute("disabled");
            }
            if (this.isSubmitting == false) {
                form.reset();
            }
        }

        this.discussionTopicSaved = (response) => {
            alert("SUCCESSS");
            this.setState({ showFormDiscussionTopicInEditMode: false });
            this.loadRecord();

        }
        this.handleErrorSubmitDiscussionTopic = (e) => {
            alert("Error Update Discussion Topic: " + e);
        }

        // ajax calls

        this.storeDiscussionTopic = (discussionTopic) => {
            this.commonAjax(this.discussionTopicService.store, discussionTopic,
                this.discussionTopicSaved, this.handleErrorSubmitDiscussionTopic);
        }
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
        this.setFormTemporaryInputs();
    }

    render() {
        if (null == this.isLoggedUserNull()) {
            return null;
        }

        const title = this.title("Notulensi Rapat");
        
        if (this.state.recordNotFound) {
            return <div>{title}<Message className="is-danger" body="Record Not Found" /></div>
        }

        if (this.getRecordId() != null && this.state.isLoadingRecord) {
            return <div>{title}<h3>Please Wait...</h3></div>
        }
        let notulis = "";
        if (this.meetingNote != null && this.meetingNote.user != null) {
            notulis = this.meetingNote.user.display_name;
        } else {
           notulis = this.getLoggedUser().display_name;
        }
        const formTitle = <>
            <Link to="/meetingnote">Notulensi</Link>&nbsp;<i className="fas fa-angle-right"></i>&nbsp;Form
        </>

        return (
            <div>
                {title}
                {this.state.showFormDiscussionTopicInEditMode ?
                    <FormAddDiscussionTopic onSubmit={this.onSubmitDiscussionTopic}
                        onClose={(e) => this.setState({ showFormDiscussionTopicInEditMode: false })}
                    /> : null
                }
                <form id={FORM_ID} onSubmit={this.onSubmit}>
                    <Card title={formTitle}>
                        {this.getRecordId() != null && this.meetingNote != null ?
                            <FormUpperTag meetingNote={this.meetingNote} /> : null}
                        
                        <InputField required={true} label="Tanggal" name="date" type="date" />
                        <InputField required={true} label="Tempat" name="place" />
                        <LabelField label="Tema Pembahasan" >
                            <span className="tag is-dark">
                                <b>{this.state.discussionTopicCount.length}</b></span>
                        </LabelField>
                        <LabelField label="Notulis" >{notulis}</LabelField>
                    </Card>

                    {/* ---------- discussion topics forms ----------- */}
                    {this.state.discussionTopicCount.map((id, i) => {
                        const isClosed = this.isDiscussionTopicClosed(id);
                        const title = "Tema Pembahasan #" + (i + 1);// +", id:"+id;
                        return (
                            <Card title={title} key={"disc_topic_field_" + i}
                            >
                                {isClosed ?
                                    <span className="tag is-primary"><i className="fas fa-check" />&nbsp;Closed</span> :
                                    null}
                                {this.getRecordId() == null && this.state.discussionTopicCount.length > 1 ?
                                    <ButtonRemoveTopic id={id} removeDiscussionTopic={
                                        this.removeDiscussionTopic} /> : null}

                                <InputField className="discussion-topic" required={true} label="Pembahasan" name={TOPIC_PREFIX + id + "_content"} type="textarea" />
                                <InputField className="discussion-topic" required={true} label="Keputusan" name={TOPIC_PREFIX + id + "_decision"} type="textarea" />
                                <InputField className="discussion-topic" required={true} label="Deadline" name={TOPIC_PREFIX + id + "_deadline_date"} type="date" />
                                <InputField className="discussion-topic" required={true} label="Penganggung Jawab" name={TOPIC_PREFIX + id + "_person_in_charge"} />

                                {this.getRecordId() != null ? <LinkEditAndAction id={id} /> : null}
                            </Card>
                        )
                    })}
                    <ButtonAddTopic addDiscussionTopic={this.addDiscussionTopic} />
                    {this.getRecordId() == null ?
                    <Card title="Action">
                        <SubmitResetButton submitText={"Create"} withReset={true} />
                    </Card>
                        : null}
                </form>
            </div>
        )
    }
}

const FormAddDiscussionTopic = (props) => {
    return (
        <ModalBackdrop >
            <div className="container">
                <Card title="Tambah Tema Pembahasan"
                    headerIconClassName="fas fa-times"
                    headerIconOnClick={props.onClose}
                >
                    <form onSubmit={props.onSubmit}>
                        <InputField className="discussion-topic" required={true} label="Pembahasan" name={"content"} type="textarea" />
                        <InputField className="discussion-topic" required={true} label="Keputusan" name={"decision"} type="textarea" />
                        <InputField className="discussion-topic" required={true} label="Deadline" name={"deadline_date"} type="date" />
                        <InputField className="discussion-topic" required={true} label="Penganggung Jawab" name={"person_in_charge"} />
                        <SubmitResetButton />
                    </form>
                    <div className="level">
                        <div className="level-left">
                        <a className="button" onClick={props.onClose}>Close</a>
                        </div>
                    </div>
                    
                </Card>
            </div>
        </ModalBackdrop>
    )
}

const extractTopicDiscussionIndexAndName = (elementName) => {
    const result = {
        index: 0,
        name: null,
    }
    let elementNameSplitKey = elementName.split(TOPIC_PREFIX);
    let elementNameSplitIndex = elementNameSplitKey[1].split("_");
    result.index = parseInt(elementNameSplitIndex[0]);
    result.name = elementName.split(TOPIC_PREFIX + result.index + "_")[1];
    return result;
}

const ButtonRemoveTopic = (props) => {

    return (
        <a className="button is-danger is-outlined" onClick={(e) => props.removeDiscussionTopic(props.id)}>
            <span className="icon"><i className="fas fa-times" /></span>
            <span>Remove</span>
        </a>
    )
}

const DiscussionTopicStatusInfo = (props) => {
    const meetingNote = props.meetingNote;
    if (null == meetingNote) return null;
    const discussion_topics = meetingNote.discussion_topics;
    if (null == discussion_topics) return null;
    let closed = 0;
    for (let i = 0; i < discussion_topics.length; i++) {
        const element = discussion_topics[i];
        if (element.is_closed) {
            closed++;
        }
    }

    return (
        <table><tbody><tr >
            <td style={{ border: 'none' }}>
                <div className="tags has-addons are-small">
                    <span className="tag is-light">Closed</span>
                    <span className="tag is-info">{closed}</span>
                </div>
            </td><td style={{ border: 'none' }}>
                <div className="tags has-addons are-small">
                    <span className="tag is-light">Not Closed</span>
                    <span className="tag is-danger">{discussion_topics.length - closed}</span>
                </div></td>
        </tr></tbody></table>
    )
}

const ButtonAddTopic = (props) => {
    return (
        <div className="has-text-centered">
            <a className="button is-primary is-outlined" onClick={props.addDiscussionTopic}
                style={{ marginTop: '10px', marginBottom: '10px' }}>
                <span className="icon">
                    <i className="fas fa-plus"></i>
                </span>
                <span>{"Tambah Tema Pembahasan"}</span>
            </a>
        </div>
    )
}

const LinkEditAndAction = (props) => {
    const id = props.id;
    return (
        <div className="buttons has-addons">
            <Link to={"/discussiontopics/" + id} className="button is-warning">
                <i className="fas fa-edit" />&nbsp;Edit
            </Link>
            <Link to={"/discussiontopics/" + id + "/action"} className="button is-primary">
                <i className="fas fa-location-arrow" />&nbsp;Konfirmasi
            </Link></div>
    )
}
const InputField = (props) => {

    return formComponent.InputField(props);
}

const FormUpperTag = (props) => {
    const meetingNote = props.meetingNote;
    return (
        <div style={{ marginBottom: '20px' }}>
            <div className="level">
                <div className="level-left" >
                    <DiscussionTopicStatusInfo meetingNote={meetingNote} />
                </div>
                <div className="level-right">
                    <span className="tag is-primary is-medium">{meetingNote.departement.name}</span>
                </div>
            </div>
        </div>
    );
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