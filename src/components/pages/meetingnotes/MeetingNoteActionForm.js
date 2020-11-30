
import React, { Component } from 'react';

import { Route, Switch, withRouter, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import BaseComponent from '../../BaseComponent';
import MeetingNoteSerivce from '../../../services/MeetingNoteSerivce';
import Message from '../../messages/Message';
import * as formComponent from '../../forms/commons';
import Card from '../../container/Card';
import { SubmitResetButton } from '../../forms/commons';
import { LabelField } from './../../forms/commons';
import { dateStringDayMonthYearFromText } from './../../../utils/DateUtil';

const FORM_ID = "form-input-meeting-note-action";
class MeetingNoteActionForm extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            recordNotFound: false,
            isLoadingRecord: true,
            showDetailNote: true,
        }
        this.meetingNote = {};
        this.meetingNoteService = MeetingNoteSerivce.instance;
        this.getRecordId = () => {
            return this.props.match.params.id;
        }
        this.hideDetailNote = () => {
            this.setState({showDetailNote:false});
        }
        this.showDetailNote = () => {
            this.setState({showDetailNote:true});
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
                note_id : this.meetingNote.id
            };
            for (let i = 0; i < inputs.length; i++) {
                const element = inputs[i];
                if (null != element.value && "" != element.value) {
                    action[element.name] = element.value;
                }
            }

            console.debug("meetingNote action>>", action);
            this.storeAction(action);

        }

        this.handleSuccessSubmit = (response) => {
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
            this.meetingNote = response.meeting_note;
            this.setState({ isLoadingRecord: false, recordNotFound: false });
        }

        // ajax calls

        this.storeAction = (action) => {
            this.commonAjax(this.meetingNoteService.storeAction, action,
                this.handleSuccessSubmit, this.handleErrorSubmit);
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
        document.title = "Action Form";
        if (this.getRecordId() == null) {
            this.backToLogin();
        }
        this.loadRecord();
    }

    componentDidUpdate() {
    }

    render() {

        if (this.state.recordNotFound) {
            return <Message className="is-danger" body="Record Not Found" />
        }

        if (this.state.isLoadingRecord) {
            return <h3>Please Wait...</h3>
        }

        const loggedUser = this.props.loggedUser;
        if (null == loggedUser) {
            return <></>
        }
        return (
            <div>
                <h2 style={{ textAlign: 'center' }}>Konfirmasi Rapat Departemen {this.props.loggedUser.departement.name}</h2>
                <Card title="Detail Notulen">
                    {this.getRecordId() != null && this.meetingNote != null ?
                        <h3>Status : {this.meetingNote.is_closed ? "Closed" : "Not Closed"}</h3> :
                        null}
                    {this.state.showDetailNote? 
                    <article style={{ marginBottom: '10px' }} className="is-info">
                        <div className="message-header">
                            <p>Detail Notulen</p>
                            <button onClick={this.hideDetailNote} className="delete" aria-label="delete"></button>
                        </div>
                        <div className="message-body has-background-light">
                            <LabelField label="Waktu dan Tempat">
                                <p>{this.meetingNote.place}, {dateStringDayMonthYearFromText(this.meetingNote.date)}</p>
                            </LabelField>
                            <LabelField label="Pembahasan">
                                <p>{this.meetingNote.content}</p>
                            </LabelField>
                            <LabelField label="Keputusan">
                                <p>{this.meetingNote.decision}</p>
                            </LabelField>
                            <LabelField label="Deadline">
                                <p>{dateStringDayMonthYearFromText(this.meetingNote.deadline_date)}</p>
                            </LabelField>
                            <LabelField label="Penganggung Jawab">
                                <p>{this.meetingNote.person_in_charge}</p>
                            </LabelField>

                        </div>
                    </article>
                    :
                    <a className="button" onClick={this.showDetailNote}>Tampilkan Detail Notulen</a>
                    }
                </Card>
                <Card title="Formulir Konfirmasi">
                    {this.meetingNote.action == null ?
                    <form id={FORM_ID} onSubmit={this.onSubmit}>
                            <InputField required={true} label="Tanggal" name="date" type="date" />
                            <InputField required={true} label="Keterangan" name="description" type="textarea" />
                            <SubmitResetButton submitText={"Submit"} withReset={true} />
                    </form>
                    :
                    <article style={{ marginBottom: '10px' }} className="is-info">
                        <div className="message-header">
                            <p>Detail Konfirmasi</p>
                        </div>
                        <div className="message-body has-background-light">
                            <LabelField label="Tanggal">
                                <p>{this.meetingNote.action.date}</p>
                            </LabelField>
                            <LabelField label="Keterangan">
                                <p>{this.meetingNote.action.description}</p>
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
    //   getMeetingNotes: (request, app) => dispatch(actions.meetingNotesAction.list(request, app)),
})

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(MeetingNoteActionForm));