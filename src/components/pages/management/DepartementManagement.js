import React, { Component } from 'react';
import BaseAdminPage from '../BaseAdminPage';
import { Route, Switch, withRouter, Link } from 'react-router-dom'
import Card from '../../container/Card';
import * as formComponent from '../../forms/commons';
import MasterManagementService from '../../../services/MasterDataService';
import { connect } from 'react-redux';
import NavButtons from '../../buttons/NavButtons';
import BaseManagementPage from './BaseManagementPage';
import Columns from './../../container/Columns';
import { CommonTitle } from '../../BaseComponent';
import { applicationAction } from '../../../redux/actions/actionCreators';
import { DATA_KEY_DEPARTEMENTS } from './../../../constant/ApplicationDataKeys';
class DeparementManagement extends BaseManagementPage {
    constructor(props) {
        super(props, "Departement", "departement");
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
        this.onSuccessDelete = (response) => {
            this.removeDataFromStore(response.record_id);
            this.showConfirmation("Record has been deleted").then(this.loadRecords);
        }
        this.removeDataFromStore = (id) => {
            const appData = this.props.applicationData;
            const departementList = appData[DATA_KEY_DEPARTEMENTS];
            if (null == departementList) { return; }
            const exist = departementList.find(dep => dep.id == id) != null;
            if (!exist) return;

            for (let i = 0; i < departementList.length; i++) {
                const element = departementList[i];
                if (element.id == id) {
                    departementList.splice(i, 1);
                    break;
                }
            }

            this.props.storeApplicationData(DATA_KEY_DEPARTEMENTS, departementList);
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
        const recordList = recordData == null ||
            recordData.result_list == null ? [] :
            recordData.result_list;
        return (
            <div>
                <CommonTitle>Departement Management</CommonTitle>
                <Card title="Departement">
                    {this.linkToFormCreate("/management/departements/create", "Tambah Data")}
                    <form id="list-form" onSubmit={(e) => { e.preventDefault(); this.filter(e.target) }}>
                        <Columns cells={[
                            formComponent.ButtonApplyResetFilter(), navButtons
                        ]} />
                        <div style={{ overflow: 'scroll' }}>
                            <table className="table">
                                <TableHeadWithFilter
                                    onButtonOrderClick={this.onButtonOrderClick}
                                    headers={[
                                        { text: 'No' },
                                        { text: 'id', withFilter: true },
                                        { text: 'name', withFilter: true },
                                        { text: 'description', withFilter: true },
                                        { text: 'action' }
                                    ]} />
                                <tbody>
                                    {recordList.map((item, i) => {
                                        const indexBegin = (this.page - 1) * this.limit;
                                        return (<tr key={"record_" + i}>
                                            <td>{indexBegin + i + 1}</td>
                                            <td>{item.id}</td>
                                            <td>{item.name}</td>
                                            <td>{item.description}</td>
                                            <td>
                                                {this.buttonsModifyAndDelete(
                                                    "/management/departements/" + item.id,
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
        loginStatus: state.userState.loginStatus,
        applicationData: state.applicationState.applicationData
    }
}
const mapDispatchToProps = dispatch => ({
    storeApplicationData: (code, data) => dispatch(applicationAction.storeApplicationData(code, data)),
})
export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(DeparementManagement));