import React, { Component } from 'react';
import BaseAdminPage from '../BaseAdminPage';
import { Route, Switch, withRouter, Link } from 'react-router-dom'
import Card from '../../container/Card';
import * as formComponent from '../../forms/commons';
import MasterManagementService from '../../../services/MasterDataService';
import { connect } from 'react-redux';
import NavButtons from '../../buttons/NavButtons';
import BaseManagementPage from './BaseManagementPage';
class DeparementManagement extends BaseManagementPage {
    constructor(props) {
        super(props, "Departement");
        this.state = {};

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
        this.commonAjax(this.masterDataService.departementList, request, this.successLoaded, this.errorLoaded);
    }
    createNavButton() {
        const recordData = this.recordData != null ? this.recordData  : null;

        if (null == recordData) {
            return <></>
        }
        return <NavButtons onClick={this.loadRecordByPage} limit={this.limit}
            totalData={recordData.count} activeIndex={this.page} />
    }

    render() {
        const navButtons = this.createNavButton();
        const recordData = this.recordData != null ? this.recordData : null;
        const recordList = recordData == null ||
                recordData.result_list == null ? [] :
                recordData.result_list;
        return (
            <div>
                <h2 style={{ textAlign: 'center' }}>Departement Management</h2>
                <Card title="Departement">
                    {navButtons}
                    <form id="list-form" onSubmit={(e) => { e.preventDefault(); this.filter(e.target) }}>
                       {formComponent.ButtonApplyResetFilter()}
                        <table style={{ tableLayout: 'fixed' }} className="table">
                            <TableHeadWithFilter
                                onButtonOrderClick={this.onButtonOrderClick}
                                headers={[
                                    { text: 'No' },
                                    { text: 'id', withFilter: true },
                                    { text: 'name', withFilter: true },
                                    { text: 'description', withFilter: true },
                                    { text: 'action'}
                                ]} />
                            {recordList.map((item, i) => {
                                const indexBegin = (this.page - 1) * this.limit;
                                return (<tr>
                                    <td>{indexBegin + i + 1}</td>
                                    <td>{item.id}</td>
                                    <td>{item.name}</td>
                                    <td>{item.description}</td>
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
    connect(mapStateToProps)(DeparementManagement));