
import React, { Component } from 'react';

import { Route, Switch, withRouter, Link } from 'react-router-dom'
import * as actions from '../../redux/actionCreators'
import { connect } from 'react-redux'
import * as formComponent from '../forms/commons';
import NavButtons from './../buttons/NavButtons';
import BaseComponent, { CommonTitle } from './../BaseComponent';
import Card from '../container/Card';
import { getDiffDaysToNow } from './../../utils/DateUtil';
class Dashboard extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {};

        this.page = 1;
        this.limit = 5;
        this.count = 0;
        this.orderBy = 'id';
        this.orderType = 'asc';
        this.fieldsFilter = {};

        this.getMeetingNotesByPage = (page) => {
            this.page = page;
            this.getMeetingNotes();
        }

        this.getMeetingNotes = () => {
            this.readInputForm();

            const request = {
                page: this.page,
                limit: this.limit,
                orderBy: this.orderBy,
                orderType: this.orderType,
                fieldsFilter: this.fieldsFilter
            };

            this.props.getMeetingNotes(request, this.props.app);
        }

        this.initialize = () => {
            const hasFilter = this.props.meetingNoteData != null && this.props.meetingNoteData.filter != null;
            const filter = hasFilter ? this.props.meetingNoteData.filter : null;
            this.page = hasFilter ? filter.page : 1;
            this.limit = hasFilter ? filter.limit : 5;
            this.count = hasFilter ? filter.count : 0;
            this.orderBy = hasFilter ? filter.orderBy : null;
            this.orderType = hasFilter ? filter.orderType : null;
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

        this.filter = (form) => {

            this.page = 1;
            this.getMeetingNotes();
        }

        this.onButtonOrderClick = (e) => {
            this.orderBy = e.target.getAttribute("data")
            this.orderType = e.target.getAttribute("sort");
            console.debug(e.target, "by ", this.orderBy, this.orderType);
            e.preventDefault();
            
            this.getMeetingNotes();
        }

        this.onSubmitClick = (e) => {
            e.preventDefault();
            this.filter(document.getElementById("list-form"));
        }

        this.populateDefaultInputs = () => {
            if (null == this.props.meetingNoteData || null == this.props.meetingNoteData.filter) {
                return;
            }
            const fieldsFilter = this.props.meetingNoteData.filter.fieldsFilter;
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
    componentWillMount() {

        this.validateLoginStatus();
        this.initialize();
    }
    componentDidMount() {
        if (null == this.props.meetingNoteData) {
            this.getMeetingNotes();
        }
        document.title = "Dashboard";
        this.populateDefaultInputs();
    }

    createNavButton() {

        if (null == this.props.meetingNoteData) {

            return <></>
        }
        return <NavButtons onClick={this.getMeetingNotesByPage} limit={this.limit}
            totalData={this.props.meetingNoteData.count} activeIndex={this.page} />
    }

    render() {
        if (null == this.props.loggedUser) {
            return null;
        }

        const meetingNoteData = this.props.meetingNoteData;
        const meetingNoteList = meetingNoteData && meetingNoteData.result_list ? meetingNoteData.result_list : [];
        const navButtons = this.createNavButton();

        return (
            <div>
                <CommonTitle>Dashboard</CommonTitle>
                <Card title={this.props.loggedUser.display_name} >
                    <p>Bidang {this.props.loggedUser.departement.name}</p>
                </Card>

                <Card title="Daftar Notulen Rapat">

                    {/* record list */}
                    {navButtons}
                    <form id="list-form" onSubmit={(e) => { e.preventDefault(); this.filter(e.target) }}>
                        {formComponent.ButtonApplyResetFilter()}
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
                            {meetingNoteList.map((item, i) => {
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

const TableHeadWithFilter = (props) => {
    return formComponent.TableHeadWithFilter(props);
}


const mapStateToProps = state => {

    return {
        loggedUser: state.userState.loggedUser,
        loginStatus: state.userState.loginStatus,
        meetingNoteData: state.meetingNoteState.meetingNoteData
    }
}
const mapDispatchToProps = dispatch => ({
    getMeetingNotes: (request, app) => dispatch(actions.meetingNotesAction.list(request, app)),
})

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(Dashboard));