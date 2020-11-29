import React from 'react';
import BaseAdminPage from './../BaseAdminPage';

export default class BaseManagementPage extends BaseAdminPage {
    constructor(props) {
        super(props);
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
