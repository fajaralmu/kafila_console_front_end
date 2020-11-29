import React, { Component } from 'react';
import BaseAdminPage from './../BaseAdminPage';
import { Route, Switch, withRouter, Link } from 'react-router-dom'
import Card from './../../container/Card';
import * as formComponent from '../../forms/commons';
import MasterManagementService from './../../../services/MasterDataService';
import { connect } from 'react-redux';
import NavButtons from './../../buttons/NavButtons';
class UsersManahement extends BaseAdminPage {
    constructor(props) {
        super(props);
        this.state = {};

        this.masterDataService = MasterManagementService.instance;
        this.page = 1;
        this.limit = 5;
        this.count = 0;
        this.orderBy = 'id';
        this.orderType = 'asc';
        this.fieldsFilter = {};
        this.recordData = null;

        this.initialize = () => {
            const hasFilter = this.getUsersDataStored() != null && this.getUsersDataStored().filter != null;
            const filter = hasFilter ? this.getUsersDataStored().filter : null;
            this.page = hasFilter ? filter.page : 1;
            this.limit = hasFilter ? filter.limit : 5;
            this.count = hasFilter ? filter.count : 0;
            this.orderBy = hasFilter ? filter.orderBy : null;
            this.orderType = hasFilter ? filter.orderType : null;

            if (null == this.getUsersDataStored()) {
                this.loadRecords();
            } else {
                this.recordData = this.masterDataService.usersData;
            }
        }

        this.successLoaded = (response) => {
            this.masterDataService.setUsersData(response);
            this.recordData = response;
        }

        this.errorLoaded = (e) => {

        }

        this.getUsersDataStored = () => {
            return this.masterDataService.usersData;
        }

        this.loadRecords = () => {
            this.readInputForm();
            const request = {
                page: this.page,
                limit: this.limit,
                orderBy: this.orderBy,
                orderType: this.orderType,
                fieldsFilter: this.fieldsFilter
            };
            this.commonAjax(this.masterDataService.userList, request, this.successLoaded, this.errorLoaded);
        }

        this.loadRecordByPage = (page) => {
            this.page = page;
            this.loadRecords();
        }

        this.onButtonOrderClick = (e) => {
            e.preventDefault();
            this.orderBy = e.target.getAttribute("data")
            this.orderType = e.target.getAttribute("sort");
            this.loadRecords();
        }

        this.readInputForm = () => {
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

        this.filter = (e) => {
            this.page = 1;
            this.loadRecords();
        }

        this.populateDefaultInputs = () => {
            const recordData = this.recordData != null ? this.recordData : this.getUsersDataStored() != null ?
        this.getUsersDataStored() : null;
        
        if(null ==recordData) {
            return;
        }
            const fieldsFilter = recordData.filter.fieldsFilter;
            for (const key in fieldsFilter) {
                if (fieldsFilter.hasOwnProperty(key)) {
                    const element = fieldsFilter[key];
                    try {
                        document.getElementById("input-form-" + key).value = element;
                    } catch (error) {
                        //
                    }
                }
            }
        }
    }
    createNavButton() {
        const recordData = this.recordData != null ? this.recordData : this.getUsersDataStored() != null ?
        this.getUsersDataStored() : null;
        
        if (null == recordData) {
            return <></>
        }
        return <NavButtons onClick={this.loadRecordByPage} limit={this.limit}
            totalData={recordData.count} activeIndex={this.page} />
    }
    componentDidMount() {
        document.title = "Users Management";
        // this.initialize();
        this.loadRecords();
    }
    render() {
        const navButtons = this.createNavButton();
        const recordData = this.recordData != null ? this.recordData : this.getUsersDataStored() != null ?
        this.getUsersDataStored() : null;
        const recordList =
            recordData == null ||
                recordData.result_list == null ? [] :
                recordData.result_list;
        return (
            <div>
                <h2 style={{ textAlign: 'center' }}>Users Management</h2>
                <Card title="Users">
                    {navButtons}
                    <form id="list-form" onSubmit={(e) => { e.preventDefault(); this.filter(e.target) }}>
                        <button type="reset" className="button is-danger">
                            <span className="icon">
                                <i className="fas fa-sync"></i>
                            </span>
                            <span>Reset Filter</span>
                        </button>
                        <button type="submit" className="button is-info">
                            <span className="icon">
                                <i className="fas fa-search"></i>
                            </span>
                            <span>Submit</span>
                        </button>
                        <table style={{ tableLayout: 'fixed' }} className="table">
                            <TableHeadWithFilter
                                onButtonOrderClick={this.onButtonOrderClick}
                                headers={[
                                    { text: 'No' },
                                    { text: 'id', withFilter: true },
                                    { text: 'email', withFilter: true },
                                    { text: 'display_name', withFilter: true },
                                    { text: 'departement', withFilter: true },
                                    { text: 'action', },
                                ]} />
                            {recordList.map((item, i) => {
                                const indexBegin = (this.page - 1) * this.limit;
                                return (<tr>
                                    <td>{indexBegin + i + 1}</td>
                                    <td>{item.id}</td>
                                    <td>{item.email}</td>
                                    <td>{item.display_name}</td>
                                    <td>{item.departement.name}</td>
                                    <td> - </td>
                                </tr>)
                            })}
                        </table>
                    </form>
                </Card>
            </div>
        )
    }
}
const TableHeadWithFilter = (props) => {
    return formComponent.TableHeadWithFilter(props);
}
const mapStateToProps = state => {

    return {
        loggedUser: state.userState.loggedUser,
        loginStatus: state.userState.loginStatus
    }
}
export default withRouter(
    connect(mapStateToProps)(UsersManahement));