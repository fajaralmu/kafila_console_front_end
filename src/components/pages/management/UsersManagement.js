import React, { Component } from 'react';
import BaseAdminPage from './../BaseAdminPage';
import { Route, Switch, withRouter, Link } from 'react-router-dom'
import Card from './../../container/Card';
import * as formComponent from '../../forms/commons';
import MasterManagementService from './../../../services/MasterDataService';
import { connect } from 'react-redux';
import NavButtons from './../../buttons/NavButtons';
import BaseManagementPage from './BaseManagementPage';
import Columns from './../../container/Columns';
import { CommonTitle } from '../../BaseComponent';

class UsersManahement extends BaseManagementPage {
    constructor(props) {
        super(props, "User", "user");
        this.state = {
            showForm: false,
        };
        this.departementList = [];
        this.masterDataService = MasterManagementService.instance;

        this.populateDefaultInputs = () => {
            const recordData = this.recordData != null ? this.recordData : null;

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
        const recordData = this.recordData != null ? this.recordData : null;

        if (null == recordData) {
            return <></>
        }
        return <NavButtons onClick={this.loadRecordByPage} limit={this.limit}
            totalData={recordData.count} activeIndex={this.page} />
    }

    render() {

        const navButtons = this.createNavButton();
        const recordData = this.recordData != null ? this.recordData : null;
        const recordList =
            (recordData == null) ||
                (recordData.result_list == null) ? [] :
                recordData.result_list;
        return (
            <div>
                <CommonTitle>Users Management</CommonTitle>
                
                <Card title="Users">
                    {this.linkToFormCreate("/management/users/create", "Tambah Data")}
                    <form id="list-form" onSubmit={(e) => { e.preventDefault(); this.filter(e.target) }}>
                        <Columns cells={[
                            formComponent.ButtonApplyResetFilter(),
                            navButtons
                        ]} />
                        <div style={{overflow:'scroll'}}>
                        <table  className="table">
                            <TableHeadWithFilter
                                onButtonOrderClick={this.onButtonOrderClick}
                                headers={[
                                    { text: 'No' },
                                    // { text: 'id', withFilter: true },
                                    { text: 'email', withFilter: true },
                                    { text: 'display_name', withFilter: true },
                                    { text: 'role', withFilter: true },
                                    { text: 'departement', withFilter: true },
                                    { text: 'action', },
                                ]} />
                                <tbody>
                            {recordList.map((item, i) => {
                                const indexBegin = (this.page - 1) * this.limit;
                                return (<tr key={"record-user-"+i}>
                                    <td>{indexBegin + i + 1}</td>
                                    {/* <td>{item.id}</td> */}
                                    <td>{item.email}</td>
                                    <td>{item.display_name}</td>
                                    <td>{item.role}</td>
                                    <td>{item.departement ? item.departement.name : '-'}</td>
                                    <td style={{width:'150px', display: 'block', border:'none'}}>
                                        {this.buttonsModifyAndDelete(  
                                            "/management/users/"+item.id,
                                            item.id)}     
                                    </td>
                                </tr>)
                            })}
                            </tbody>
                        </table>
                        </div>
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