import React, { Component } from 'react';
import BaseAdminPage from './../BaseAdminPage';
import { Route, Switch, withRouter, Link } from 'react-router-dom'
import Card from './../../container/Card';
import * as formComponent from '../../forms/commons';
import MasterManagementService from './../../../services/MasterDataService';
import { connect } from 'react-redux';
import NavButtons from './../../buttons/NavButtons';
import BaseManagementPage from './BaseManagementPage';
class UsersManahement extends BaseManagementPage {
    constructor(props) {
        super(props);
        this.state = {};

        this.masterDataService = MasterManagementService.instance;
       

        this.initialize = () => {
            const hasFilter = this.getRecordDataStored() != null && this.getRecordDataStored().filter != null;
            const filter = hasFilter ? this.getRecordDataStored().filter : null;
            this.page = hasFilter ? filter.page : 1;
            this.limit = hasFilter ? filter.limit : 5;
            this.count = hasFilter ? filter.count : 0;
            this.orderBy = hasFilter ? filter.orderBy : null;
            this.orderType = hasFilter ? filter.orderType : null;

            if (null == this.getRecordDataStored()) {
                this.loadRecords();
            } else {
                this.recordData = this.masterDataService.usersData;
            }
        }

        this.getRecordDataStored = () => {
            return this.masterDataService.usersData;
        }

        this.populateDefaultInputs = () => {
            const recordData = this.recordData != null ? this.recordData : this.getRecordDataStored() != null ?
                this.getRecordDataStored() : null;

            if (null == recordData) {
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

    loadRecords = () => {
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
    createNavButton() {
        const recordData = this.recordData != null ? this.recordData : this.getRecordDataStored() != null ?
            this.getRecordDataStored() : null;

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
        const recordData = this.recordData != null ? this.recordData : this.getRecordDataStored() != null ?
            this.getRecordDataStored() : null;
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