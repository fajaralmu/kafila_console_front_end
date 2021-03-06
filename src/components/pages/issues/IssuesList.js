import React,{ Component, Fragment } from 'react';
import BaseComponent, { CommonTitle, mapCommonUserStateToProps } from './../../BaseComponent';
import { Route, Switch, withRouter, Redirect, Link } from 'react-router-dom'
import { connect } from 'react-redux';
import Card from '../../container/Card';
import MasterManagementService from './../../../services/MasterDataService';
import BaseManagementPage from './../management/BaseManagementPage';
import NavButtons from './../../buttons/NavButtons';
import Columns from './../../container/Columns';
import { TableHeadWithFilter, ButtonApplyResetFilter } from './../../forms/commons';
import IssuesService from './../../../services/IssuesService';
import { AttachmentLink } from '../../buttons/buttons';
import { ClosedInfoTag } from './../meetingnotes/componentHelper';

class IssuesList extends BaseManagementPage
{
    constructor(props){
        super(props, "Aduan", "issue");
        this.state = {}
        this.issueService = IssuesService.instance;

        //overrid
        this.deleteRecord = (id) => {
            this.commonAjax(
                this.issueService.delete,
                id,
                this.onSuccessDelete,
                this.onErrorDelete
            )
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

        this.commonAjax(this.issueService.list, request, this.successLoaded, this.errorLoaded);
    }

    createNavButton() {
        const recordData = this.recordData != null ? this.recordData  : null;

        if (null == recordData) {
            return <></>
        }
        return <NavButtons onClick={this.loadRecordByPage} limit={this.limit}
            totalData={recordData.count} activeIndex={this.page} />
    }

    componentDidMount() {
        if(!this.validateLoginStatus()){
            return;
        }
        this.loadRecords();
        document.title = "Daftar Aduan";
    }

    //overrid baseAdminPage
    componentDidUpdate(){
        if (this.isLoggedUserNull() ) {
            this.backToLogin();
        }
    }

    render() {
        if(this.isLoggedUserNull()) {return null;}

        const navButtons = this.createNavButton();
        const recordData = this.recordData != null ? this.recordData : null;
        const recordList = recordData == null ||
                recordData.result_list == null ? [] :
                recordData.result_list;
        const isAdmin = this.props.loggedUser.role == "admin";
        return (
            <div>
                <CommonTitle>Daftar Aduan</CommonTitle>
                <Card title="Daftar Aduan">
                {!isAdmin?null:this.linkToFormCreate("/issues/create", "Tambah Aduan")}
                <form id="list-form" onSubmit={(e) => { e.preventDefault(); this.filter(e.target) }}>
                        <Columns cells={[
                            ButtonApplyResetFilter(), navButtons
                        ]} />
                        <div style={{overflow:'scroll'}}>
                        <table className="table">
                            <TableHeadWithFilter
                                onButtonOrderClick={this.onButtonOrderClick}
                                headers={[
                                    { text: 'No' },
                                    // { text: 'id', withFilter: true },
                                    { text: 'date', withFilter: true },
                                    { text: 'place', withFilter: true },
                                    { text: 'content', withFilter: true },
                                    { text: 'issuer', withFilter: true },
                                    { text: 'email', withFilter: true },
                                    { text: 'departement', withFilter: true },
                                    { text: 'issue_input', alias:'input', withFilter: true },
                                    { text: 'attachment', withFilter: true },
                                    { text: 'is_closed', alias:'Status', withFilter: true},
                                    // { text: 'closed_date', alias:'Closed', withFilter: true},
                                    { text: 'action'}
                                ]} />
                                <tbody>
                            {recordList.map((item, i) => {
                                const indexBegin = (this.page - 1) * this.limit;
                                return (<tr key={"record_"+i}>
                                    <td>{indexBegin + i + 1}</td>
                                    {/* <td>{item.id}</td> */}
                                    <td>{item.date}</td>
                                    <td>{item.place}</td>
                                    <td>{item.content && item.content.length > 10 ? item.content.substring(0, 10) + '...' : item.content}</td>
                                    <td>{item.issuer}</td>
                                    <td>{item.email}</td>
                                    <td>{item.departement.name}</td>
                                    <td>{item.issue_input}</td>
                                    <td><AttachmentLink show={item.attachment!=null} to={"upload/issue/"+item.attachment} /></td>
                                    <td ><ClosedInfoTag closed = {item.is_closed==true}/></td>
                                    {/* <td>{item.closed_date}</td> */}
                                    <td style={{width:'150px', display: 'block', border:'none'}}>
                                        {isAdmin?
                                        <Fragment>
                                            <Link to={"/issues/" + item.id} className="button is-small" >
                                                <i className="fas fa-edit"></i>
                                            </Link>
                                            {this.buttonDeleteRecord(item.id, false)}
                                        </Fragment>
                                        :null}
                                        <Link to={"/issues/" + item.id+"/followup"} className="button is-primary is-small" >
                                            <i className="fas fa-location-arrow"></i>
                                        </Link>
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

const mapDispatchToProps = dispatch => ({})

export default withRouter(connect(
    mapCommonUserStateToProps,
    mapDispatchToProps
)(IssuesList));