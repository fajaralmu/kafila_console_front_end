import React, { Component } from 'react';
import Card from '../../container/Card';
import { Route, Switch, withRouter, Link } from 'react-router-dom'
import { InputField, SelectField } from '../../forms/commons';
import BaseComponent from '../../BaseComponent';
import MasterManagementService from '../../../services/MasterDataService';
import { connect } from 'react-redux';
import Message from '../../messages/Message';
import { SubmitResetButton } from '../../forms/commons';
import BaseAdminPage from './../BaseAdminPage';

const issue_sources = [
    'Yayasan', 'Orang Tua', 'Santri', 'Tamu'
]

class IssuesForm extends BaseAdminPage {
    constructor(props) {
        super(props);
        this.state = {
            recordNotFound: false,
            isLoadingRecord: true,
            departementList: []
        };
        this.masterDataService = MasterManagementService.instance;

        this.onSubmit = (e) => {
            e.preventDefault();
            const form = e.target;
            const app = this;
            this.showConfirmation("Save Data?").then(function(accepted) {
                if (accepted) {
                    app.storeRecord(form);
                }
            });            
        }

        this.storeRecord = (form) => {
            const inputs = form.getElementsByClassName("input-form-field");
            const issue = {};
            for (let i = 0; i < inputs.length; i++) {
                const element = inputs[i];
                if (null != element.value && "" != element.value) {
                    let fieldName = element.name;

                    if (fieldName == 'departement') {
                        fieldName = 'departement_id'
                    }

                    issue[fieldName] = element.value;
                }
            }
            if (this.getRecordId() != null) {
                issue.id = this.getRecordId();
            }
            this.store(issue);
            console.debug("ISSUE: ", issue);
        }

        this.getRecordId = () => {
            return this.props.match.params.id;
        }

        this.departementListLoaded = (response) => {
            this.setState({ departementList: response.result_list });
            if (null != this.getRecordId()) {
                this.loadRecord();
            }
            console.log("departementListLoaded: ", response);
        }

        this.recordSaved = (response) => {
            this.showInfo("SUCCESS SAVING RECORD");
        }
        this.recordFailedToSave = (e) => {
            this.showError("FAILED SAVING RECORD");
        }

        this.store = (issue) => {
            this.commonAjax(
                this.masterDataService.storeIssue, issue,
                this.recordSaved, this.recordFailedToSave
            )
        }

        this.loadDepartements = () => {
            this.commonAjax(
                this.masterDataService.departementList, {},
                this.departementListLoaded,
                (error) => { }
            );
        }

        this.handleSuccessGetRecord = (response) => {

            this.setState({ isLoadingRecord: false });
            const form = document.getElementById("form-management");
            const inputs = form.getElementsByClassName("input-form-field");
            for (let i = 0; i < inputs.length; i++) {
                const element = inputs[i];

                if (element.name == "departement") {
                    element.value = response.issue.departement_id;
                } else {
                    element.value = response.issue[element.name];
                }
            }
        }

        this.handleErrorGetRecord = (e) => {
            this.setState({ recordNotFound: true })
        }

        this.loadRecord = () => {
            this.commonAjax(this.masterDataService.viewIssue, this.getRecordId(),
                this.handleSuccessGetRecord, this.handleErrorGetRecord);
        }
    }

    componentDidMount() {
        this.loadDepartements();
        document.title = "Form Aduan";
    }

    render() {

        if (this.state.recordNotFound) {
            return <Message className="is-danger" body="Record Not Found" />
        }

        if (this.getRecordId() != null && this.state.isLoadingRecord) {
            return <div>
                <h2 style={{ textAlign: 'center' }}>Form Aduan</h2><h3>Please Wait...</h3>
            </div>
        }

        const formTitle = <>
            <Link to="/issues">Aduan</Link>&nbsp;<i className="fas fa-angle-right"></i>&nbsp;Form
        </>
        return (
            <div>
                <h2 style={{ textAlign: 'center' }}>Form Aduan</h2>
                <Card title={formTitle} >
                    <form onSubmit={this.onSubmit} id="form-management" >
                        <InputField label="Tanggal" name="date" type="date" required={true} />
                        <InputField label="Tempat" name="place" required={true} />
                        <InputField label="Permasalahan" name="content" type="textarea" required={true} />
                        <InputField label="Email" name="email" required={true} type="email" />
                        <InputField label="Sumber Aduan" name="issue_input" required={true} />
                        <SelectField label="Pengadu" options={issue_sources.map(source => {
                            return {
                                value: source,
                                text: source
                            }
                        })} name="issuer" required={true} />
                        <SelectField label="Departement" options={this.state.departementList.map(dep => {
                            return {
                                value: dep.id,
                                text: dep.name
                            }
                        })} name="departement" required={true} />
                        <SubmitResetButton submitText={
                            this.getRecordId() == null ? "Create" : "Update"
                        } withReset={this.getRecordId() == null} />
                    </form>
                </Card>
            </div>
        )
    }
}

const mapStateToProps = state => {

    return {
        loggedUser: state.userState.loggedUser,
        loginStatus: state.userState.loginStatus
    }
}
export default withRouter(
    connect(mapStateToProps)(IssuesForm));