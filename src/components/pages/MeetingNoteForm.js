
import React, { Component } from 'react';

import { Route, Switch, withRouter, Redirect } from 'react-router-dom'
import * as actions from '../../redux/actionCreators'
import { connect } from 'react-redux'
import BaseComponent from './../BaseComponent';
import MeetingNoteSerivce from './../../services/MeetingNoteSerivce';
import Message from '../messages/Message';
const FORM_ID = "form-input-meeting-note";
class MeetingNoteForm extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            recordNotFound: false,
            recordFound: false
        }
        this.meetingNote = {};
        this.meetingNoteService = MeetingNoteSerivce.instance;
        this.getRecordId = () => {
            return this.props.match.params.id;
        }
        this.onSubmit = (e) => {
            e.preventDefault();
            const cofirm = window.confirm("Submit Data?");
            if (!cofirm) {
                return;
            }
            const form = e.target;
            const inputs = form.getElementsByClassName("input-meeting-note");

            this.meetingNote = {};
            for (let i = 0; i < inputs.length; i++) {
                const element = inputs[i];
                if (null != element.value && "" != element.value) {
                    this.meetingNote[element.name] = element.value;
                }
            }

            if (this.getRecordId() != null) {
                this.meetingNote.id = this.getRecordId();
            }

            console.debug("meetingNote>>", this.meetingNote);
            this.storeMeetingNote();

        }
        this.validateLoginStatus = () => {
            if (this.props.loginStatus != true || this.props.loggedUser == null) {
                this.props.history.push("/login");
            }
        }
        this.handleSuccessSubmit = (response) => {
            alert("SUCCESS");
            try {
                document.getElementById(FORM_ID).reset();
            } catch (error) { }
        }
        this.handleErrorSubmit = (error) => {
            alert("handleErrorSubmit: " + error);
        }
        this.handleErrorGetRecord = (error) => {
            this.setState({ recordNotFound: true })
        }

        this.handleSuccessGetRecord = (response) => {
            console.log("RESPONSE: ", response);
            this.setState({ recordFound: true });
            const form = document.getElementById(FORM_ID);
            const inputs = form.getElementsByClassName("input-meeting-note");
            for (let i = 0; i < inputs.length; i++) {
                const element = inputs[i];
                element.value = response.meeting_note[element.name];

                if (element.name != "content" && element.name != "decision") {
                    element.setAttribute("disabled", "disabled");
                }
            }

        }

        // ajax calls

        this.storeMeetingNote = () => {
            this.commonAjax(this.meetingNoteService.store, this.meetingNote,
                this.handleSuccessSubmit, this.handleErrorSubmit);
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
        document.title = "Meeting Note Form";
        if (this.getRecordId() != null) {
            this.loadRecord();
        }
    }

    render() {

        if (this.state.recordNotFound) {
            return <Message className="is-danger" body="Record Not Found" />
        }

        if (this.getRecordId() != null && this.state.recordFound == false) {
            return <h3>Please Wait...</h3>
        }

        return (
            <div>
                <h2 style={{ textAlign: 'center' }}>Notulensi Rapat Departemen {this.props.loggedUser.departement.name}</h2>
                <form id={FORM_ID} onSubmit={this.onSubmit}>
                    <InputField required={true} label="Tanggal" name="date" type="date" />
                    <InputField required={true} label="Tempat" name="place" />
                    <InputField required={true} label="Pembahasan" name="content" type="textarea" />
                    <InputField required={true} label="Keputusan" name="decision" type="textarea" />
                    <InputField required={true} label="Deadline" name="deadline_date" type="date" />
                    <InputField required={true} label="Penganggung Jawab" name="person_in_charge" />
                    <div className="field is-horizontal">
                        <input className="button is-link" type="submit" value="Submit" />
                        {this.getRecordId() != null ?
                            null
                            : <input className="button is-danger" type="reset" value="Reset" />
                        }
                    </div>
                </form>
            </div>
        )
    }
}

const InputField = (props) => {

    return (
        <div className="field is-horizontal">
            <div className="field-label is-normal"><label className="label">{props.label}</label></div>
            <div className="field-body">
                <div className="field">
                    <div className="control">
                        {props.required == true ?
                            props.type == 'textarea' ?
                                <textarea required className="input textarea input-meeting-note" id={'input-meeting-note-' + props.name} name={props.name}></textarea>
                                :
                                <input required type={props.type ? props.type : 'text'} id={'input-meeting-note-' + props.name} name={props.name} className="input input-meeting-note" />
                            :
                            props.type == 'textarea' ?
                                <textarea className="input textarea input-meeting-note" id={'input-meeting-note-' + props.name} name={props.name}></textarea>
                                :
                                <input type={props.type ? props.type : 'text'} id={'input-meeting-note-' + props.name} name={props.name} className="input input-meeting-note" />
                        }
                    </div>
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