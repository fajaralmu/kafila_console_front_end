import React, { Component } from 'react';
import Card from '../../container/Card';
import { Route, Switch, withRouter, Link } from 'react-router-dom'
import { InputField, SelectField, LabelField } from '../../forms/commons';
import MasterManagementService from '../../../services/MasterDataService';
import { connect } from 'react-redux';
import Message from '../../messages/Message';
import { SubmitResetButton } from '../../forms/commons';
import { CommonTitle } from '../../BaseComponent';
import DiscussionTopicsService from './../../../services/DiscussionTopicsService';
import BaseManagementPage from './../management/BaseManagementPage';
import ClosedStatus from '../../messages/ClosedStatus';
import { AttachmentLink } from '../../buttons/buttons';

class DiscussionTopicsForm extends BaseManagementPage {
    constructor(props) {
        super(props);
        this.state = {
            recordNotFound: false,
            isLoadingRecord: true,
        };
        this.discussionTopicService = DiscussionTopicsService.instance;

        this.onSubmit = (e) => {
            e.preventDefault();
            const form = e.target;
            const app = this;
            this.showConfirmation("Save Data?").then(function (accepted) {
                if (accepted) {
                    app.storeRecord(form);
                }
            });
        }

        this.storeRecord = (form) => {
            const inputs = form.getElementsByClassName("input-form-field");
            const discussionTopic = {};
            for (let i = 0; i < inputs.length; i++) {
                const element = inputs[i];
                if (null != element.value && "" != element.value) {
                    let fieldName = element.name;
                    discussionTopic[fieldName] = element.value;
                }
            }
            if (this.getRecordId() != null) {
                discussionTopic.id = this.getRecordId();
            }
            this.store(discussionTopic);
            console.debug("discussionTopic: ", discussionTopic);
        }

        this.getRecordId = () => {
            return this.props.match.params.id;
        }

        this.recordSaved = (response) => {
            this.showInfo("SUCCESS SAVING RECORD");

            if (this.getRecordId() == null) {
                this.handleSuccessGetRecord(response);
                this.props.history.push("/discussiontopics/" + response.discussion_topic.id);
            }
        }
        this.recordFailedToSave = (e) => {
            this.showError("FAILED SAVING RECORD");
        }

        this.store = (discussionTopic) => {
            this.commonAjax(
                this.discussionTopicService.store, discussionTopic,
                this.recordSaved, this.recordFailedToSave
            )
        }

        this.handleSuccessGetRecord = (response) => {
            this.recordData = response;
            this.discussionTopic = response.discussion_topic;

            const form = document.getElementById("form-management");
            const inputs = form.getElementsByClassName("input-form-field");
            for (let i = 0; i < inputs.length; i++) {
                const element = inputs[i];
                element.value = this.discussionTopic[element.name];
                if (this.isClosed() == false && element.name != "content" && element.name != "decision") {
                    element.setAttribute("disabled", "disabled");
                }

                if (this.isClosed() == true) {
                    element.setAttribute("disabled", "disabled");
                }
            }
            
            this.setState({ isLoadingRecord: false });
        }

        this.handleErrorGetRecord = (e) => {
            this.setState({ recordNotFound: true })
        }

        this.loadRecord = () => {
            this.commonAjax(this.discussionTopicService.view, this.getRecordId(),
                this.handleSuccessGetRecord, this.handleErrorGetRecord);
        }
        this.isClosed = () => {
            return this.getRecordId() != null && this.discussionTopic != null && this.discussionTopic.is_closed == true;
        }
    }

    componentDidMount() {
        if (!this.validateLoginStatus()) {
            return;
        }
        if (this.getRecordId() != null) {
            this.loadRecord();
        }
        document.title = "Form Tema Pembahasan";
    }

    render() {

        const title = this.title("Form Tema Pembahasan");
        if (this.state.recordNotFound) {
            return <div>{title}<Message className="is-danger" body="Record Not Found" /></div>
        }

        if (this.getRecordId() != null && this.state.isLoadingRecord) {
            return <div>{title}<h3>Please Wait...</h3>
            </div>
        }

        const formTitle = <>
            <Link to="/discussiontopics">Tema Pembahasan</Link>&nbsp;<i className="fas fa-angle-right"></i>&nbsp;Form
        </>
        const isClosed = this.discussionTopic.is_closed;
        return (
            <div>
                {title}
                <Card title={formTitle} >
                    {this.getRecordId() != null && this.discussionTopic != null ?
                        <div className="level">
                            <div className="level-left">
                                <ClosedStatus closed={isClosed} />
                            </div>
                            <div className="level-right">
                                <span className="tag is-primary is-medium">{this.discussionTopic.departement == null ? null : this.discussionTopic.departement.name}</span>
                            </div>
                        </div>
                        :
                        null}
                    <LinkDetailMeetingNote note_id={this.discussionTopic.note_id} />
                    <form onSubmit={this.onSubmit} id="form-management" >
                        <InputField required={true} label="Tanggal" name="date" type="date" />
                        <InputField required={true} label="Pembahasan" name="content" type="textarea" />
                        <InputField required={true} label="Keputusan" name="decision" type="textarea" />
                        <InputField required={true} label="Deadline" name="deadline_date" type="date" />
                        <InputField required={true} label="Penganggung Jawab" name="person_in_charge" />
                        <LabelField label="Attachment">
                            {this.discussionTopic.attachment? 
                            <AttachmentLink showExtension={true} to={"upload/topic/"+this.discussionTopic.attachment}/>:
                            null
                            }
                        </LabelField>
                        {this.isClosed() ? null :
                            <SubmitResetButton submitText={
                                this.getRecordId() == null ? "Create" : "Update"} withReset={this.getRecordId() == null} />
                        }
                    </form>
                </Card>
            </div>
        )
    }
}

export const LinkDetailMeetingNote = (props) => {
    const note_id = props.note_id;
    return (
        <div style={{ marginBottom: '20px' }}>
            <Link to={"/meetingnote/" + props.note_id} className="button is-info">
                <span className="icon">
                    <i className="fas fa-clipboard"></i>
                </span>
                <span>Detail Notulensi</span>
            </Link>
        </div>
    )
}

const mapStateToProps = state => {

    return {
        loggedUser: state.userState.loggedUser,
        loginStatus: state.userState.loginStatus
    }
}
export default withRouter(
    connect(mapStateToProps)(DiscussionTopicsForm));