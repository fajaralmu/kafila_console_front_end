import React, { Component } from 'react';
import Card from '../../container/Card';
import { Route, Switch, withRouter, Link } from 'react-router-dom'
import { InputField, SelectField } from '../../forms/commons';
import BaseComponent from '../../BaseComponent';
import MasterManagementService from '../../../services/MasterDataService';
import { connect } from 'react-redux';
import Message from '../../messages/Message';
import { SubmitResetButton } from '../../forms/commons';

class DepartementManagementForm extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            recordNotFound: false,
            isLoadingRecord: true,
        };
        this.masterDataService = MasterManagementService.instance;

        this.onSubmit = (e) => {
            e.preventDefault();
            if (!window.confirm("Save Departement?")) {
                return;
            }

            const form = e.target;
            const inputs = form.getElementsByClassName("input-form-field");
            const departement = {};
            for (let i = 0; i < inputs.length; i++) {
                const element = inputs[i];
                if (null != element.value && "" != element.value) {
                    let fieldName = element.name;
                    departement[fieldName] = element.value;
                }
            }
            if (this.getRecordId() != null) {
                departement.id = this.getRecordId();
            }
            this.store(departement);
            console.debug("Departement: ", departement);
        }

        this.getRecordId = () => {
            return this.props.match.params.id;
        }

        this.recordSaved = (response) => {
            alert("SUCCESS SAVING RECORD");
        }
        this.recordFailedToSave = (e) => {
            alert("FAILED SAVING RECORD");
        }

        this.store = (departement) => {
            this.commonAjax(
                this.masterDataService.storeDepartement, departement,
                this.recordSaved, this.recordFailedToSave
            )
        }

        this.handleSuccessGetRecord = (response) => {

            this.setState({ isLoadingRecord: false });
            const form = document.getElementById("form-management");
            const inputs = form.getElementsByClassName("input-form-field");
            for (let i = 0; i < inputs.length; i++) {
                const element = inputs[i];
                element.value = response.departement[element.name];

            }
        }

        this.handleErrorGetRecord = (e) => {
            this.setState({ recordNotFound: true })
        }

        this.loadRecord = () => {
            this.commonAjax(this.masterDataService.viewDepartement, this.getRecordId(),
                this.handleSuccessGetRecord, this.handleErrorGetRecord);
        }
    }

    componentDidMount() {
        document.title = "Departement Form";
        if (null != this.getRecordId()) {
            this.loadRecord();
        }
    }

    render() {

        if (this.state.recordNotFound) {
            return <Message className="is-danger" body="Record Not Found" />
        }

        if (this.getRecordId() != null && this.state.isLoadingRecord) {
            return <div>
                <h2 style={{ textAlign: 'center' }}>Departements Management</h2><h3>Please Wait...</h3>
            </div>
        }

        const formTitle = <>
            <Link to="/management/departements">Departements</Link>&nbsp;<i className="fas fa-angle-right"></i>&nbsp;Form
        </>
        return (
            <div>
                <h2 style={{ textAlign: 'center' }}>Departements Management</h2>
                <Card title={formTitle} >
                    <form onSubmit={this.onSubmit} id="form-management" >
                        <InputField label="Nama" name="name" required={true} />
                        <InputField label="Deskripsi" name="description" type="textarea" required={true} />
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
    connect(mapStateToProps)(DepartementManagementForm));