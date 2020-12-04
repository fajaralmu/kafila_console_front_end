
// import React, { Component } from 'react';

// import { Route, Switch, withRouter, Redirect, Link } from 'react-router-dom'
// import { connect } from 'react-redux'
// import BaseComponent, { CommonTitle } from '../../BaseComponent';
// import MeetingNoteSerivce from '../../../services/MeetingNoteSerivce';
// import Message from '../../messages/Message';
// import * as formComponent from '../../forms/commons';
// import Card from '../../container/Card';
// import { SubmitResetButton } from '../../forms/commons';

// const FORM_ID = "form-input-meeting-note";
// class MeetingNoteForm extends BaseComponent {
//     constructor(props) {
//         super(props);
//         this.state = {
//             recordNotFound: false,
//             isLoadingRecord: true
//         }
//         this.meetingNote = {};
//         this.isSubmitting = false;
//         this.meetingNoteService = MeetingNoteSerivce.instance;
//         this.getRecordId = () => {
//             return this.props.match.params.id;
//         }
//         this.onSubmit = (e) => {
//             e.preventDefault();
//             this.isSubmitting = true;
//             const form = e.target;
//             const app = this;
//             this.showConfirmation("Submit Data?").then(function (accepted) {
//                 if (accepted) {
//                     app.fillDataAndStore(form);
//                 }
//                 app.isSubmitting = false;
//             });
//         }

//         this.fillDataAndStore = (form) => {
//             const inputs = form.getElementsByClassName("input-form-field");

//             this.meetingNote = {};
//             for (let i = 0; i < inputs.length; i++) {
//                 const element = inputs[i];
//                 if (null != element.value && "" != element.value) {
//                     this.meetingNote[element.name] = element.value;
//                     console.debug("this.meetingNote[element.name]", this.meetingNote[element.name], "element.value", element.value);
//                 }
//                 console.debug("inputs: ", element.tagName, element.value);
//             }

//             if (this.getRecordId() != null) {
//                 this.meetingNote.id = this.getRecordId();
//             }

//             console.debug("inputs size:", inputs.length, "meetingNote>>", this.meetingNote);
//             this.storeMeetingNote();

//         }

//         this.recordSaved = (response) => {
//             this.showInfo("SUCCESS");
//             try {
//                 if (this.getRecordId() == null) {
//                     this.handleSuccessGetRecord(response);
//                     this.props.history.push("/meetingnote/"+response.meeting_note.id);
//                 }
//             } catch (error) { }
//         }
//         this.handleErrorSubmit = (error) => {
//             this.showError("handleErrorSubmit: " + error);
//         }
//         this.handleErrorGetRecord = (error) => {
//             this.setState({ recordNotFound: true })
//         }

//         this.handleSuccessGetRecord = (response) => {
//             this.meetingNote = response.meeting_note;
//             this.setState({ isLoadingRecord: false });
//             const form = document.getElementById(FORM_ID);
//             const inputs = form.getElementsByClassName("input-form-field");
//             for (let i = 0; i < inputs.length; i++) {
//                 const element = inputs[i];
//                 element.value = response.meeting_note[element.name];

//                 if (this.isClosed() == false &&
//                     element.name != "content" && element.name != "decision") {
//                     element.setAttribute("disabled", "disabled");
//                 }

//                 if (this.isClosed()) {
//                     element.setAttribute("disabled", "disabled");
//                 }
//             }

//         }
//         this.enableInputs = () => {
//             const form = document.getElementById(FORM_ID);
//             const inputs = form.getElementsByClassName("input-form-field");
//             for (let i = 0; i < inputs.length; i++) {
//                 const element = inputs[i];
//                 element.removeAttribute("disabled");
//             }
//             if (this.isSubmitting == false) {
//                 form.reset();
//             }
//         }

//         // ajax calls

//         this.storeMeetingNote = () => {
//             this.commonAjax(this.meetingNoteService.store, this.meetingNote,
//                 this.recordSaved, this.handleErrorSubmit);
//         }
//         this.loadRecord = () => {
//             this.commonAjax(this.meetingNoteService.view, this.getRecordId(),
//                 this.handleSuccessGetRecord, this.handleErrorGetRecord);
//         }
//         this.isClosed = () => {
//             return this.getRecordId() != null && this.meetingNote != null && this.meetingNote.is_closed == true;
//         }
//     }

//     componentWillMount() {
//         this.validateLoginStatus();
//     }

//     componentDidMount() {
//         document.title = "Meeting Note Form";
//         if (this.getRecordId() != null) {
//             this.loadRecord();
//         }
//     }

//     componentDidUpdate() {
//         if (this.getRecordId() == null) {
//             this.enableInputs();
//         }
//     }

//     render() {

//         if (this.state.recordNotFound) {
//             return <Message className="is-danger" body="Record Not Found" />
//         }

//         if (this.getRecordId() != null && this.state.isLoadingRecord) {
//             return <h3>Please Wait...</h3>
//         }

//         const loggedUser = this.props.loggedUser;
//         if (null == loggedUser) {
//             return <></>
//         }
//         return (
//             <div>
//                 <CommonTitle>Notulensi Rapat Departemen {this.props.loggedUser.departement.name}</CommonTitle>
//                 <Card title="Formulir Notulensi">
//                     {this.getRecordId() != null && this.meetingNote != null ?
//                         <div className="level">
//                             <div className="level-left">
//                                 <div className="tags has-addons are-medium">
//                                     <span className="tag is-dark">Status</span>
//                                     <span className="tag is-info">{this.meetingNote.is_closed == true ? "Closed" : "Not Closed"}</span>
//                                 </div></div>
//                             <div className="level-right">
//                                 <span className="tag is-primary is-medium">{this.meetingNote.departement.name}</span>
//                             </div>
//                         </div>
//                         :
//                         null}
//                     <form id={FORM_ID} onSubmit={this.onSubmit}>
//                         <InputField required={true} label="Tanggal" name="date" type="date" />
//                         <InputField required={true} label="Tempat" name="place" />
//                         <InputField required={true} label="Pembahasan" name="dicussion_topic_1_content" type="textarea" />
//                         <InputField required={true} label="Keputusan" name="dicussion_topic_1_decision" type="textarea" />
//                         <InputField required={true} label="Deadline" name="dicussion_topic_1_deadline_date" type="date" />
//                         <InputField required={true} label="Penganggung Jawab" name="dicussion_topic_1_person_in_charge" />
//                         {this.isClosed() ? null :
//                             <SubmitResetButton submitText={
//                                 this.getRecordId() == null ? "Create" : "Update"} withReset={this.getRecordId() == null} />
//                         }
//                     </form>
//                     <Link to={"/discussiontopics/create"} className="button is-primary" style={{marginTop:'10px', marginBottom:'10px'}}>
//                         <span className="icon">
//                             <i className="fas fa-plus"></i>
//                         </span>
//                         <span>{"Tambah Tema Pembahasan"}</span>
//                     </Link>
//                 </Card>
//             </div>
//         )
//     }
// }

// const InputField = (props) => {

//     return formComponent.InputField(props);
// }


// const mapStateToProps = state => {

//     return {
//         loggedUser: state.userState.loggedUser,
//         loginStatus: state.userState.loginStatus,
//     }
// }
// const mapDispatchToProps = dispatch => ({
//     //   getMeetingNotes: (request, app) => dispatch(actions.meetingNotesAction.list(request, app)),
// })

// export default withRouter(connect(
//     mapStateToProps,
//     mapDispatchToProps
// )(MeetingNoteForm));