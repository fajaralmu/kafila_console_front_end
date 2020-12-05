import React, { Component } from 'react';
import { Route, Switch, withRouter, Redirect, Link } from 'react-router-dom'
import { connect } from 'react-redux';
import Card from '../../container/Card';
import BaseManagementPage from '../management/BaseManagementPage';
import NavButtons from '../../buttons/NavButtons';
import Columns from '../../container/Columns';
import { TableHeadWithFilter, ButtonApplyResetFilter } from '../../forms/commons';
import { getDiffDaysToNow } from '../../../utils/DateUtil';
import MeetingNoteSerivce from './../../../services/MeetingNoteSerivce';
import { CommonTitle } from '../../BaseComponent';

class MeetingNoteList extends BaseManagementPage {
    constructor(props) {
        super(props, "Notulensi", "notes");
        this.state = {}
        this.meetingNoteService = MeetingNoteSerivce.instance;

        //override
        this.deleteRecord = (id) => { }
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

        this.commonAjax(this.meetingNoteService.list, request, this.successLoaded, this.errorLoaded);
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
        document.title = "Daftar Notulensi";
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
                <CommonTitle>Daftar Notulensi</CommonTitle>
                <Card title="Daftar Notulensi">

                    <form id="list-form" onSubmit={(e) => { e.preventDefault(); this.filter(e.target) }}>
                        <Columns cells={[
                            ButtonApplyResetFilter(), navButtons
                        ]} />
                        <div style={{overflow:'scroll'}}>
                        <table style={{   }} className="table">
                            <TableHeadWithFilter
                                onButtonOrderClick={this.onButtonOrderClick}
                                headers={[
                                    { text: 'No' },
                                    { text: 'id', alias:"Id", withFilter: true },
                                    { text: 'date', alias:"Tanggal", withFilter: true },
                                    { text: 'place', alias:"Tempat", withFilter: true },
                                    { text: 'departement', alias:"Bidang", withFilter: true },
                                    { text: 'user', alias:"Notulis", withFilter: true },
                                    { text: 'Topik Diskusi', },
                                    { text: 'Closed', },
                                    { text: 'action', },
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
                                return (<tr key={"record-meeting-note-"+i} style={style}>
                                    <td>{indexBegin + i + 1}</td>
                                    <td>{item.id}</td>
                                    <td>{item.date}</td>
                                    <td>{item.place}</td>
                                    <td>{item.departement?item.departement.name:"-"}</td>
                                    <td>{item.user?item.user.name:"-"}</td>
                                    <td>
                                        {item.discussion_topics?item.discussion_topics.length:0}
                                    </td>
                                    <td>
                                        {calculateClosedTopic(item.discussion_topics)}
                                    </td>
                                    <td>
                                        <LinkEditPage id={item.id}/>
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

const calculateClosedTopic = (discussion_topics) => {
    if (null == discussion_topics) {
        return 0;
    }
    let closed = 0;
    for (let i = 0; i < discussion_topics.length; i++) {
        const element = discussion_topics[i];
        if (element.is_closed == true) {
            closed++;
        }
    }   
    return closed;
}

const LinkEditPage = (props) => {
    return (
        <Link to={"/meetingnote/" + props.id} className="button is-small" >
        <i className="fas fa-edit"></i>
    </Link>
    )
}

const mapStateToProps = state => {

    return {
        loggedUser: state.userState.loggedUser,
        loginStatus: state.userState.loginStatus,
    }
}
const mapDispatchToProps = dispatch => ({
    //   getMeetingNotes: (request, app) => dispatch(actions.meetingNotesAction.list(request, app)),
})

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(MeetingNoteList));