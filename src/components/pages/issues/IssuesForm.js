import React, { Component } from 'react';
import Card from '../../container/Card';
import { Route, Switch, withRouter, Link } from 'react-router-dom'
import { InputField, SelectField, LabelField } from '../../forms/commons';
import BaseComponent, { CommonTitle, mapCommonUserStateToProps } from '../../BaseComponent';
import MasterManagementService from '../../../services/MasterDataService';
import { connect } from 'react-redux';
import Message from '../../messages/Message';
import { SubmitResetButton } from '../../forms/commons';
import BaseAdminPage from './../BaseAdminPage';
import { applicationAction } from '../../../redux/actions/actionCreators';
import { DATA_KEY_DEPARTEMENTS } from './../../../constant/ApplicationDataKeys';
import { toBase64v2, getAttachmentData } from './../../../utils/ComponentUtil';
import { AttachmentLink } from '../../buttons/buttons';
import ClosedStatus from './../../messages/ClosedStatus';

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
        this.attachmentData = null;
        this.record = null;
        this.masterDataService = MasterManagementService.instance;

        this.onSubmit = (e) => {
            e.preventDefault();
            const form = e.target;
            const app = this;
            this.showConfirmation("Save Data?").then(function (accepted) {
                if (accepted) {
                    app.fillDataAndStore(form);
                }
            });
        }

        this.updateAttachmentData = (e) => {
            const app = this;
            getAttachmentData(e.target).then(function(data){
                app.attachmentData = data;
            }).catch(console.error);
        }

        this.fillDataAndStore = (form) => {
            const inputs = form.getElementsByClassName("input-form-field");
            const issue = {};
            for (let i = 0; i < inputs.length; i++) {
                const element = inputs[i];
                if (null != element.value && "" != element.value) {
                    let fieldName = element.name;

                    if (fieldName == 'departement') {
                        fieldName = 'departement_id'
                    }
                    if (fieldName == "attachment") {
                        issue[fieldName+"_info"] = this.attachmentData
                    } else {
                        issue[fieldName] = element.value
                    }
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
            this.showInfo("Success saving record");
            this.attachmentData = null;
            this.record = response.issue;
            if (this.getRecordId() == null) {
                this.handleSuccessGetRecord(response);
                this.props.history.push("/issues/" + response.issue.id);
            }
        }

        this.store = (issue) => {
            this.commonAjax(this.masterDataService.storeIssue, issue,
                this.recordSaved, null)
        }

        this.loadDepartements = () => {
            const appData = this.props.applicationData;
            console.debug("appdata: ", appData);
            if (appData[DATA_KEY_DEPARTEMENTS] == null ||
                appData[DATA_KEY_DEPARTEMENTS].length == 0) {
                this.commonAjax(
                    this.masterDataService.departementList, {},
                    this.departementListLoaded,
                    (error) => { }
                );
            } else {
                this.departementList = appData[DATA_KEY_DEPARTEMENTS];
                if (null != this.getRecordId()) {
                    this.loadRecord();
                }
                this.refresh();
            }
        }

        this.handleSuccessGetRecord = (response) => {
            this.record = response.issue;
            this.setState({ isLoadingRecord: false });
            const form = document.getElementById("form-management");
            const inputs = form.getElementsByClassName("input-form-field");
            for (let i = 0; i < inputs.length; i++) {
                const element = inputs[i];
                if (element.name == "attachment") {  continue; }

                if (element.name == "departement") {
                    element.value = response.issue.departement_id;
                } else {
                    element.value = response.issue[element.name];
                }
            }
            
        }

        this.handleErrorGetRecord = (e) => {
            console.error(e);
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
        const title = this.title("Form Aduan");
        if (this.getRecordId() != null && this.state.isLoadingRecord) {
            return <div>{title}<h3>Please Wait...</h3></div>
        }

        const formTitle = <>
            <Link to="/issues">Aduan</Link>&nbsp;<i className="fas fa-angle-right"></i>&nbsp;Form
        </>
        const isClosed =  this.getRecordId()!=null && this.record != null && this.record.is_closed;
        return (
            <div>
                {title}
                <Card title={formTitle} >
                    <ClosedStatus show={this.getRecordId()!=null && this.record != null} closed={isClosed} />
                    <form onSubmit={this.onSubmit} id="form-management" >
                        <InputField label="Tanggal" name="date" type="date" required={true} />
                        <InputField label="Tempat" name="place" required={true} />
                        <InputField label="Permasalahan" name="content" type="textarea" required={true} />
                        <InputField name="email" type="email" note="Kosongkan jika berstatus anonim" />
                         <SelectField label="Pengadu" options={issue_sources.map(source => {
                            return {
                                value: source,
                                text: source
                            }
                        })} name="issuer" required={true} />
                        <SelectField label="Bidang" options={this.departementList.map(dep => {
                            return {
                                value: dep.id,
                                text: dep.name
                            }
                        })} name="departement" required={true} />
                        {this.getRecordId()!=null && this.record != null ?
                            <LabelField label="Attachment">
                                 <AttachmentLink show={this.record.attachment!=null} to={"upload/issue/"+this.record.attachment} />
                            </LabelField>
                            :
                            <InputField name="attachment" attributes={{accept:'image/*', onChange:this.updateAttachmentData}} type="file" note="Kosongkan jika tidak ada dokumen" />
                        
                        }
                      
                        <InputField label="Sumber Aduan" name="issue_input" required={true} />
                       <SubmitResetButton submitText={
                            this.getRecordId() == null ? "Create" : "Update"
                        } withReset={this.getRecordId() == null} />
                    </form>
                </Card>
            </div>
        )
    }
}
const mapDispatchToProps = dispatch => ({
    storeApplicationData: (code, data) => dispatch(applicationAction.storeApplicationData(code, data)),
})
export default withRouter(
    connect(mapCommonUserStateToProps, mapDispatchToProps)(IssuesForm));