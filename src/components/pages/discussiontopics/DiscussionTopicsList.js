import React, { Component } from 'react';
import { Route, Switch, withRouter, Redirect, Link } from 'react-router-dom'
import { connect } from 'react-redux';
import Card from '../../container/Card';
import BaseManagementPage from '../management/BaseManagementPage';
import NavButtons from '../../buttons/NavButtons';
import Columns from '../../container/Columns';
import { TableHeadWithFilter, ButtonApplyResetFilter } from '../../forms/commons';
import IssuesService from '../../../services/IssuesService';
import DiscussionTopicsService from './../../../services/DiscussionTopicsService';
import { getDiffDaysToNow } from './../../../utils/DateUtil';
import { CommonTitle, mapCommonUserStateToProps } from '../../BaseComponent';
import { LinkToFormCreate } from './../meetingnotes/MeetingNoteList';
import { AttachmentLink } from '../../buttons/buttons';
import { ClosedInfoTag } from '../meetingnotes/componentHelper';
// const title = "Daftar Tema Pembahasan";
const title = "Daftar Topik";
        
class DiscussionTopicsList extends BaseManagementPage {
    constructor(props) {
        super(props, "Topik Pembahasan", "discussiontopic");
        this.state = {}
        this.discussionTopicService = DiscussionTopicsService.instance;

        //override
        this.deleteRecord = (id) => {
            // this.commonAjax(
            //     this.discussionTopicService.delete,
            //     id,
            //     this.onSuccessDelete,
            //     this.onErrorDelete
            // )
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

        this.commonAjax(this.discussionTopicService.list, request, this.successLoaded, this.errorLoaded);
    }

    createNavButton() {
        const recordData = this.recordData != null ? this.recordData : null;

        if (null == recordData) {
            return <></>
        }
        return <NavButtons onClick={this.loadRecordByPage} limit={this.limit}
            totalData={recordData.count} activeIndex={this.page} />
    }

    componentDidMount() {
        if (!this.validateLoginStatus()) {
            return;
        }
        this.loadRecords();
        document.title = title;
    }

    //override baseAdminPage
    componentDidUpdate() {
        if (this.props.loginStatus == false || this.isLoggedUserNull()) {
            this.backToLogin();
        }
    }

    render() {
        if (null == this.props.loggedUser) {
            return null;
        }
        const navButtons = this.createNavButton();
        const recordData = this.recordData != null ? this.recordData : null;
        const recordList = recordData == null ||
            recordData.result_list == null ? [] :
            recordData.result_list;
        return (
            <div>
                <CommonTitle>{title}</CommonTitle>
                <Card title={title}>
                <LinkToFormCreate to="meetingnote/create">Tambah Notulensi</LinkToFormCreate>
                    <form id="list-form" onSubmit={(e) => { e.preventDefault(); this.filter(e.target) }}>
                        <Columns cells={[
                            ButtonApplyResetFilter(), navButtons
                        ]} />
                        <div style={{ overflow: 'scroll' }}>
                            <table className="table">
                                <TableHeadWithFilter
                                    onButtonOrderClick={this.onButtonOrderClick}
                                    headers={[
                                        { text: 'No' },
                                        // { text: 'id', alias: "Id", withFilter: true },
                                        // { text: 'date', alias: "Tanggal", withFilter: true },
                                        { text: 'content', alias: "Topik", withFilter: true },
                                        // { text: 'decision', alias: "Keputusan", withFilter: true },
                                        { text: 'person_in_charge', alias: "PIC", withFilter: true },
                                        { text: 'deadline_date', alias: "Deadline", withFilter: true },
                                        // { text: 'departement', alias: "Bidang", withFilter: true },
                                        { text: 'is_closed', alias: 'Status', withFilter: true },
                                        // { text: 'closed_date', alias: 'Closed', withFilter: true },
                                        { text: 'attachment', withFilter: true },
                                        { text: 'action' },
                                        { text: 'opsi' },
                                    ]} />
                                <tbody>
                                    {recordList.map((item, i) => {
                                        const indexBegin = (this.page - 1) * this.limit;
                                        const deadlineDate = Date.parse(item.deadline_date);
                                        const style = {};
                                        try {
                                            const diffDay = getDiffDaysToNow(new Date(deadlineDate));
                                            if (item.is_closed == false && diffDay <= 3 && diffDay > 0) {
                                                style.backgroundColor = 'orange';
                                            } else if (item.is_closed == false && diffDay < 0) {
                                                style.backgroundColor = 'red';
                                            }
                                        } catch (e) {
                                            //
                                        }
                                        return (<tr key={"record_" + i} style={style}>
                                            <td>{indexBegin + i + 1}</td>
                                            {/* <td>{item.id}</td> */}
                                            {/* <td>{item.date}</td> */}
                                            <td>{item.content && item.content.length > 10 ? item.content.substring(0, 10) + '...' : item.content}</td>
                                            {/* <td>{item.decision && item.decision.length > 10 ? item.decision.substring(0, 10) + '...' : item.decision}</td> */}
                                            <td>{item.person_in_charge}</td>
                                             <td>{item.deadline_date}</td>
                                            {/* <td>{item.departement.name}</td> */}
                                            <td><ClosedInfoTag closed={item.is_closed}/></td>
                                            {/* <td>
                                                {item.closed_date}
                                            </td> */}
                                            <td><AttachmentLink showExtension={true} show={item.attachment!=null} to={"upload/topic/"+item.attachment}/></td>
                                            <td><LinkEditAndAction id={item.id} />
                                            </td>
                                            <td>
                                                <Link to={"/meetingnote/" + item.note_id} className="button is-light is-small">
                                                    <span className="icon">
                                                        <i className="fas fa-clipboard" />
                                                    </span>
                                                    <span>Notulensi</span>
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

const LinkEditAndAction = (props) => {
    return (<React.Fragment>
            <Link to={"/discussiontopics/" + props.id} className="button is-small" >
                <i className="fas fa-edit"></i>
            </Link>
            <Link to={"/discussiontopics/" + props.id + "/action"} className="button is-primary is-small" >
                <i className="fas fa-location-arrow"></i>
            </Link>
        </React.Fragment>)
}

const mapDispatchToProps = dispatch => ({})

export default withRouter(connect(
    mapCommonUserStateToProps,
    mapDispatchToProps
)(DiscussionTopicsList));