import React, { Component } from 'react';
import Card from '../../container/Card';
import { Route, Switch, withRouter, Link } from 'react-router-dom'
import { InputField, SelectField } from '../../forms/commons';
import BaseComponent, { CommonTitle } from '../../BaseComponent';
import MasterManagementService from '../../../services/MasterDataService';
import { connect } from 'react-redux';
import Message from '../../messages/Message';
import { SubmitResetButton } from '../../forms/commons';
import { applicationAction } from '../../../redux/actions/actionCreators';
import { DATA_KEY_DEPARTEMENTS } from './../../../constant/ApplicationDataKeys';

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
            const form = e.target;
            const app = this;
            this.showConfirmation("Save Data?").then(function(accepted){
                if (accepted) {
                    app.storeDepartement(form);
                }
            });
           
        }

        this.storeDepartement = (form) => {
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

        this.updateLocallyStoredDepartements = (departement) => {
            const appData = this.props.applicationData;
            const departementList = appData[DATA_KEY_DEPARTEMENTS];
            if (null == departementList) {return;}
            const exist = departementList.find(dep => dep.id == departement.id) != null;
            if (exist) {
                for (let i = 0; i < departementList.length; i++) {
                    const element = departementList[i];
                    if (element.id == departement.id) {
                        departementList[i] = departement;
                        break;
                    }
                }
                
            } else {
                departementList.push(departement);
            }
            this.props.storeApplicationData(DATA_KEY_DEPARTEMENTS, departementList);
        }

        this.recordSaved = (response) => {
            this.showInfo("SUCCESS SAVING RECORD");
            this.updateLocallyStoredDepartements(response.departement);
            if (this.getRecordId() == null) {
                this.handleSuccessGetRecord(response);
                this.props.history.push("/management/departements/"+response.departement.id);
            }
        }
        this.recordFailedToSave = (e) => {
            this.showError("FAILED SAVING RECORD");
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
                <CommonTitle>Departements Management</CommonTitle>
                <h3>Please Wait...</h3>
            </div>
        }

        const formTitle = <>
            <Link to="/management/departements">Departements</Link>&nbsp;<i className="fas fa-angle-right"></i>&nbsp;Form
        </>
        return (
            <div>
               {this.title("Manajemen Bidang")}
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
        loginStatus: state.userState.loginStatus,
        applicationData: state.applicationState.applicationData
    }
}
const mapDispatchToProps = dispatch => ({
    storeApplicationData: (code, data) => dispatch(applicationAction.storeApplicationData(code, data)),
})
export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(DepartementManagementForm));