import React, { Component } from 'react';
import Card from '../../container/Card';
import { Route, Switch, withRouter, Link } from 'react-router-dom'
import { InputField, SelectField } from '../../forms/commons';
import BaseComponent from './../../BaseComponent';
import MasterManagementService from './../../../services/MasterDataService';
import { connect } from 'react-redux';
import Message from './../../messages/Message';
import { SubmitResetButton } from './../../forms/commons';

class UserManagementForm extends BaseComponent {
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
            if (!window.confirm("Save User?")) {
                return;
            }

            const form = e.target;
            const inputs = form.getElementsByClassName("input-form-field");
            const user = {};
            for (let i = 0; i < inputs.length; i++) {
                const element = inputs[i];
                if (null != element.value && "" != element.value) {
                    let fieldName = element.name;

                    if (fieldName == 'departement') {
                        fieldName = 'departement_id'
                    }

                    user[fieldName] = element.value;
                }
            }
            if (this.getRecordId() != null) {
                user.id = this.getRecordId();
            }
            this.store(user);
            console.debug("USER: ", user);
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
            alert("SUCCESS SAVING RECORD");
        }
        this.recordFailedToSave = (e) => {
            alert("FAILED SAVING RECORD");
        }

        this.store = (user) => {
            this.commonAjax(
                this.masterDataService.storeUser, user,
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
                    element.value = response.user.departement_id;
                } else {

                    element.value = response.user[element.name];
                }
            }
        }

        this.handleErrorGetRecord = (e) => {
            this.setState({ recordNotFound: true })
        }

        this.loadRecord = () => {
            this.commonAjax(this.masterDataService.viewUser, this.getRecordId(),
                this.handleSuccessGetRecord, this.handleErrorGetRecord);
        }
    }

    componentDidMount() {
        this.loadDepartements();
        document.title = "User Form";
    }

    render() {

        if (this.state.recordNotFound) {
            return <Message className="is-danger" body="Record Not Found" />
        }

        if (this.getRecordId() != null && this.state.isLoadingRecord) {
            return <div>
                <h2 style={{ textAlign: 'center' }}>Users Management</h2><h3>Please Wait...</h3>
            </div>
        }

        const formTitle = <>
            <Link to="/management/users">Users</Link>&nbsp;<i className="fas fa-angle-right"></i>&nbsp;Form
        </>
        return (
            <div>
                <h2 style={{ textAlign: 'center' }}>Users Management</h2>
                <Card title={formTitle} >
                    <form onSubmit={this.onSubmit} id="form-management" >
                        <InputField label="Email" name="email" required={true} type="email" />
                        <InputField label="Username" name="name" required={true} />
                        <InputField label="Display Name" name="display_name" required={true} />
                        {/* <InputField label="Role" name="role" required={true} /> */}
                        <InputField label="Password" name="password" required={true} />
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
    connect(mapStateToProps)(UserManagementForm));