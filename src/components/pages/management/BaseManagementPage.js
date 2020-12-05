import React from 'react';
import BaseAdminPage from './../BaseAdminPage';
import { Link } from 'react-router-dom';
import MasterManagementService from './../../../services/MasterDataService';

export default class BaseManagementPage extends BaseAdminPage {
    constructor(props, name, code) {
        super(props);
        this.masterDataServce = MasterManagementService.instance;
        this.code = code;
        this.name = name;
        this.page = 1;
        this.limit = 5;
        this.count = 0;
        this.orderBy = 'id';
        this.orderType = 'asc';
        this.fieldsFilter = {};
        this.recordData = null;

        this.successLoaded = (response) => {
            this.recordData = response;
        }

        this.errorLoaded = (e) => {
            console.error("Error loading resource: ", e);
        }

        this.getRecordDataStored = () => {
            return null;
        }
        this.loadRecordByPage = (page) => {
            super.page = page;
            this.loadRecords();
        }

        this.onButtonOrderClick = (e) => {
            e.preventDefault();
            this.orderBy = e.target.getAttribute("data")
            this.orderType = e.target.getAttribute("sort");
            this.loadRecords();
        }

        this.filter = (e) => {
            this.page = 1;
            this.loadRecords();
        }

        this.delete = (id) => {
            const app = this;
            this.showConfirmation("Delete "+this.name+"?")
            .then(function(accepted) {
                if(accepted) {
                    app.deleteRecord(id);
                }
            });
        }

        this.onSuccessDelete = (response) => {
            this.showConfirmation("Record has been deleted").then(this.loadRecords);
        }

        this.onErrorDelete = (e) => {
            this.showError("Error Delete Record");
        }

        this.deleteRecord = (id) => {
            this.commonAjax(
                this.masterDataServce.deleteRecord,
                {code: this.code, id: id},
                this.onSuccessDelete,
                this.onErrorDelete
            )
        }

        this.linkToFormCreate = (link, label) => {
            return (
                <Link to={link} className="button is-primary" style={{marginBottom:'10px'}}>
                        <span className="icon">
                            <i className="fas fa-plus"></i>
                        </span>
                        <span>{label}</span>
                    </Link>
            )
        }
        this.linkToFormEdit = (link, withText = true) => {
            return (
                <Link to={link} className="button is-warning is-small">
                        <span className="icon">
                            <i className="fas fa-edit"></i>
                        </span>
                        {withText?
                        <span>Edit</span>
                        :null}
                    </Link>
            )
        }

        this.buttonsModifyAndDelete = (editLink, id) => {
            return (
                <div className="buttons has-addons">
                    {this.linkToFormEdit(editLink, false)}
                    {this.buttonDeleteRecord(id, false)}
                </div>
            )
        }

        this.buttonDeleteRecord = (id, withText = true) => {
            return (
                <a onClick={()=>this.delete(id)} className="button is-danger is-small">
                    <span className="icon">
                        <i className="fas fa-trash"></i>
                    </span>
                    {withText?
                    <span>Delete</span>
                    :null}
                </a>
            )
        }

    }

    componentDidMount() {
        document.title = this.name + " Management";
        this.loadRecords();
    }

    loadRecords = () => {

    }

    
    readInputForm = () => {
        const form = document.getElementById('list-form');
        if (form == null) return;
        const inputs = form.getElementsByClassName("form-filter");

        this.fieldsFilter = {};
        for (let i = 0; i < inputs.length; i++) {
            const element = inputs[i];
            if (null != element.value && "" != element.value) {
                this.fieldsFilter[element.name] = element.value;
            }
        }
    }
}
