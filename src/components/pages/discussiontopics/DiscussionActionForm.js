
import React, { Component } from 'react';

import { Route, Switch, withRouter, Redirect, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import BaseComponent, { CommonTitle } from '../../BaseComponent';
import Message from '../../messages/Message';
import * as formComponent from '../../forms/commons';
import Card from '../../container/Card';
import { SubmitResetButton } from '../../forms/commons';
import { LabelField } from '../../forms/commons';
import { dateStringDayMonthYearFromText } from '../../../utils/DateUtil';
import IssuesService from '../../../services/IssuesService';
import DiscussionTopicsService from './../../../services/DiscussionTopicsService';
import { LinkDetailMeetingNote } from './DiscussionTopicsForm';

const FORM_ID = "form-input-discussion-action";
class DiscussionActionForm extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            recordNotFound: false,
            isLoadingRecord: true,
            showDetailDiscussionTopic: true,
        }
        this.discussionTopic = {};
        this.discussionTopicSerivce = DiscussionTopicsService.instance;
        this.getRecordId = () => {
            return this.props.match.params.id;
        }
        this.hideDetailIssue = () => {
            this.setState({showDetailDiscussionTopic:false});
        }
        this.showDetailDiscussionTopic = () => {
            this.setState({showDetailDiscussionTopic:true});
        }
        this.onSubmit = (e) => {
            e.preventDefault();

            const form = e.target;
            const app = this;
            this.showConfirmation("Submit Data?").then(function (accepted) {
                if (accepted) {
                    app.fillDataAndStore(form);
                }
            });
        }

        this.fillDataAndStore = (form) => {
            const inputs = form.getElementsByClassName("input-form-field");

            const action = {
                topic_id : this.discussionTopic.id
            };
            for (let i = 0; i < inputs.length; i++) {
                const element = inputs[i];
                if (null != element.value && "" != element.value) {
                    action[element.name] = element.value;
                }
            }

            console.debug("issue action>>", action);
            this.storeAction(action);

        }

        this.handleSuccessSubmit = (response) => {
            this.discussionTopic.action = response.discussion_action;
            this.discussionTopic.is_closed = true;
            this.showInfo("SUCCESS");
            try {
                if (this.getRecordId() == null) {
                    document.getElementById(FORM_ID).reset();
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
            this.discussionTopic = response.discussion_topic;
            this.setState({ isLoadingRecord: false, recordNotFound: false });
        }

        // ajax calls

        this.storeAction = (action) => {
            this.commonAjax(this.discussionTopicSerivce.storeAction, action,
                this.handleSuccessSubmit, this.handleErrorSubmit);
        }
        this.loadRecord = () => {
            this.commonAjax(this.discussionTopicSerivce.view, this.getRecordId(),
                this.handleSuccessGetRecord, this.handleErrorGetRecord);
        }
        this.isClosed = () => {
            return this.getRecordId() != null && this.discussionTopic != null && this.discussionTopic.is_closed == true;
        }
    }

    componentDidMount() {
        if(!this.validateLoginStatus()){
            return;
        }
        document.title = "Konfirmasi Tema Pembahasan";
        if (this.getRecordId() == null) {
            this.backToLogin();
        }
        this.loadRecord();
    }
 
    render() {
        
        const loggedUser = this.props.loggedUser;
        if (null == loggedUser) {
            return null;
        }
        
        const title = this.title("Penyelesaian/Pelaksanaan Keputusan");
        if (this.state.recordNotFound) {
            return <div>{title}<Message className="is-danger" body="Record Not Found" /></div>
        }

        if (this.state.isLoadingRecord) {
            return <div>{title}<h3>Please Wait...</h3></div>
        }

        return (
            <div>
                {title}
                <Card title="Detail Tema Pembahasan">
                    <div className="tags has-addons are-medium">
                        <span className="tag is-dark">Status</span>
                        <span className="tag is-info">{this.discussionTopic.is_closed ? "Closed" : "Not Closed"}</span>
                    </div>
                    <LinkDetailMeetingNote note_id={this.discussionTopic.note_id} />
                    {this.state.showDetailDiscussionTopic? 
                    <article style={{ marginBottom: '10px' }} className="is-info">
                        <div className="message-header">
                            <p>Detail Tema Pembahasan</p>
                            <button onClick={this.hideDetailIssue} className="delete" aria-label="delete"></button>
                        </div>
                        <div className="message-body has-background-light">
                        <LabelField label="Waktu">
                                <p>{dateStringDayMonthYearFromText(this.discussionTopic.date)}</p>
                            </LabelField>
                            <LabelField label="Bidang">
                                <p>{this.discussionTopic.departement.name}</p>
                            </LabelField>
                            <LabelField label="Pembahasan">
                                <p>{this.discussionTopic.content}</p>
                            </LabelField>
                            <LabelField label="Keputusan">
                                <p>{this.discussionTopic.decision}</p>
                            </LabelField>
                            <LabelField label="Deadline">
                                <p>{dateStringDayMonthYearFromText(this.discussionTopic.deadline_date)}</p>
                            </LabelField>
                            <LabelField label="Penganggung Jawab">
                                <p>{this.discussionTopic.person_in_charge}</p>
                            </LabelField>

                        </div>
                    </article>
                    :
                    <a className="button" onClick={this.showDetailDiscussionTopic}>Tampilkan Detail Tema Pembahasan</a>
                    }
                </Card>
                <Card title="Penyelesaian/Pelaksanaan Keputusan">
                    {this.discussionTopic.action == null ?
                    <form id={FORM_ID} onSubmit={this.onSubmit}>
                            <InputField required={true} label="Tanggal" name="date" type="date" />
                            <InputField required={true} label="Keterangan" name="description" type="textarea" />
                            <SubmitResetButton submitText={"Submit"} withReset={true} />
                    </form>
                    :
                    <article style={{ marginBottom: '10px' }} className="is-info">
                        <div className="message-header">
                            <p>Detail Tindak Lanjut</p>
                        </div>
                        <div className="message-body has-background-light">
                            <LabelField label="Tanggal">
                                <p>{this.discussionTopic.action.date}</p>
                            </LabelField>
                            <LabelField label="Keterangan">
                                <p>{this.discussionTopic.action.description}</p>
                            </LabelField>
                        </div>
                    </article>
                    }
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
    //   getissues: (request, app) => dispatch(actions.issuesAction.list(request, app)),
})

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(DiscussionActionForm));