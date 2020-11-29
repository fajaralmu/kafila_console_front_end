import React from 'react';
import BaseAdminPage from './../BaseAdminPage';
import { Link } from 'react-router-dom';

export default class BaseManagementPage extends BaseAdminPage {
    constructor(props, name) {
        super(props);

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

        this.linkToFormCreate = (link, label) => {
            return (
                <Link to={link} className="button is-primary">
                        <span className="icon">
                            <i className="fas fa-plus"></i>
                        </span>
                        <span>{label}</span>
                    </Link>
            )
        }
        this.linkToFormEdit = (link) => {
            return (
                <Link to={link} className="button is-warning">
                        <span className="icon">
                            <i className="fas fa-edit"></i>
                        </span>
                        <span>Edit</span>
                    </Link>
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
