
import React, { Component } from 'react';

import { Route, Switch, withRouter, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import BaseComponent, { CommonTitle } from '../../BaseComponent';
import Message from '../../messages/Message';
import * as formComponent from '../../forms/commons';
import Card from '../../container/Card';
import { SubmitResetButton } from '../../forms/commons';
import { LabelField } from '../../forms/commons';
import { dateStringDayMonthYearFromText } from '../../../utils/DateUtil';
import IssuesService from './../../../services/IssuesService';
import { AnchorWithIcon, AttachmentLink } from './../../buttons/buttons';
import ClosedStatus from './../../messages/ClosedStatus';

const FORM_ID = "form-input-follow-up-issue";
class IssuesFollowingUpForm extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            recordNotFound: false,
            isLoadingRecord: true,
            showDetailIssue: true,
        }
        this.issue = {};
        this.issueService = IssuesService.instance;
        this.getRecordId = () => {
            return this.props.match.params.id;
        }
        this.hideDetailIssue = () => {
            this.setState({ showDetailIssue: false });
        }
        this.showDetailIssue = () => {
            this.setState({ showDetailIssue: true });
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
                issue_id: this.issue.id
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
            this.issue.follow_up = response.followed_up_issue;
            this.issue.is_closed = true;
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
            this.issue = response.issue;
            this.setState({ isLoadingRecord: false, recordNotFound: false });
        }

        // ajax calls

        this.storeAction = (followUp) => {
            this.commonAjax(this.issueService.followUpIssue, followUp,
                this.handleSuccessSubmit, this.handleErrorSubmit);
        }
        this.loadRecord = () => {
            this.commonAjax(this.issueService.view, this.getRecordId(),
                this.handleSuccessGetRecord, this.handleErrorGetRecord);
        }
        this.isClosed = () => {
            return this.getRecordId() != null && this.issue != null && this.issue.is_closed == true;
        }
    }
    componentDidMount() {
        if (!this.validateLoginStatus()) {
            return;
        }
        document.title = "Follow Up Issue";
        if (this.getRecordId() == null) {
            this.backToLogin();
        }
        this.loadRecord();
    }


    render() {

        if (this.state.recordNotFound) {
            return <Message className="is-danger" body="Record Not Found" />
        }

        if (this.state.isLoadingRecord) {
            return <h3>Please Wait...</h3>
        }

        if (this.isLoggedUserNull()) {
            return null;
        }
        const isClosed = this.issue.is_closed;
        return (
            <div>
                <CommonTitle>Tindak Lanjut Aduan</CommonTitle>

                <Card title="Detail Aduan">
                    <ClosedStatus closed={isClosed} />
                    {this.state.showDetailIssue ?
                        <article style={{ marginBottom: '10px' }} className="is-info">
                            <div className="message-header">
                                <p>Detail Aduan</p>
                                <button onClick={this.hideDetailIssue} className="delete" aria-label="delete"></button>
                            </div>
                            <div className="message-body has-background-light">
                                <LabelField label="Waktu dan Tempat">
                                    <p>{this.issue.place}, {dateStringDayMonthYearFromText(this.issue.date)}</p>
                                </LabelField>
                                <LabelField label="Bidang">
                                    <p>{this.issue.departement.name}</p>
                                </LabelField>
                                <LabelField label="Permasalahan">
                                    <p>{this.issue.content}</p>
                                </LabelField>
                                <LabelField label="Pengadu">
                                    <p>{this.issue.email}, {this.issue.issuer}</p>
                                </LabelField>
                                <LabelField label="Sumber Input">
                                    <p>{this.issue.issue_input}</p>
                                </LabelField>
                                <LabelField label="Attachment">
                                    {this.issue.attachment?
                                    <AttachmentLink to={"upload/issue/"+this.issue.attachment} />
                                    :null}
                                </LabelField>

                            </div>
                        </article>
                        :
                        <AnchorWithIcon iconClassName="fas fa-angle-down" onClick={this.showDetailIssue}>
                            Detail Aduan
                    </AnchorWithIcon>
                    }
                </Card>
                <Card title="Formulir Tindak Lanjut">
                    {this.issue.follow_up == null ?
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
                                <LabelField label="Tanggal"><p>{this.issue.follow_up.date}</p></LabelField>
                                <LabelField label="Keterangan"><p>{this.issue.follow_up.description}</p></LabelField>
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
)(IssuesFollowingUpForm));