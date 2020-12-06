import React, { Component } from 'react';
import Card from '../../container/Card';
import { Route, Switch, withRouter, Link } from 'react-router-dom'
import { InputField, SelectField } from '../../forms/commons';
import BaseComponent, { CommonTitle } from '../../BaseComponent';
import MasterManagementService from '../../../services/MasterDataService';
import { connect } from 'react-redux';
import Message from '../../messages/Message';
import { SubmitResetButton } from '../../forms/commons';
import BaseAdminPage from './../BaseAdminPage';
import { applicationAction } from '../../../redux/actions/actionCreators';
import { DATA_KEY_DEPARTEMENTS } from './../../../constant/ApplicationDataKeys';

export const issue_sources = [
    'Yayasan', 'Orang Tua', 'Santri', 'Pegawai', 'Tamu',
]

class IssuesForm extends BaseAdminPage {
    constructor(props) {
        super(props);
        this.state = {
            recordNotFound: false,
            isLoadingRecord: true,
        };
        this.departementList = [];
        this.masterDataService = MasterManagementService.instance;

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
            this.departementList= response.result_list;
            if (null != this.getRecordId()) {
                this.loadRecord();
            }
            this.props.storeApplicationData(DATA_KEY_DEPARTEMENTS, this.departementList);
        }

        this.recordSaved = (response) => {
            this.showInfo("SUCCESS SAVING RECORD");

            if (this.getRecordId() == null) {
                this.handleSuccessGetRecord(response);
                this.props.history.push("/issues/" + response.issue.id);
            }
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
            const appData = this.props.applicationData;
            if (appData[DATA_KEY_DEPARTEMENTS] == null ||
                appData[DATA_KEY_DEPARTEMENTS].length == 0) {
                this.commonAjax(
                    this.masterDataService.departementList, {},
                    this.departementListLoaded,
                    (error) => { }
                );
            } else {
                this.departementList = appData[DATA_KEY_DEPARTEMENTS];
               
            }
            this.refresh();
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
        if (!this.validateLoginStatus()) {
            return;
        }
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
                <CommonTitle>Form Aduan</CommonTitle>
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
                        <SelectField label="Departement" options={this.departementList.map(dep => {
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
        loginStatus: state.userState.loginStatus,
        applicationData: state.applicationState.applicationData
    }
}

const mapDispatchToProps = dispatch => ({
    storeApplicationData: (code, data) => dispatch(applicationAction.storeApplicationData(code, data)),
})
export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(IssuesForm));