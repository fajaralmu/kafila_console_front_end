
import React, { Component } from 'react';

import { Route, Switch, withRouter, Link } from 'react-router-dom'
import * as actions from '../../redux/actionCreators'
import { connect } from 'react-redux'
import * as formComponent from '../forms/commons';
import NavButtons from './../buttons/NavButtons';
import BaseComponent from './../BaseComponent';
import Card from '../container/Card';
class Dashboard extends BaseComponent {

    constructor(props) {
        super(props);

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
            e.preventDefault();
            this.orderBy = e.target.getAttribute("data")
            this.orderType = e.target.getAttribute("sort");
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
                <h2 style={{ textAlign: 'center' }}>Dashboard</h2>
                <Card title={this.props.loggedUser.display_name} >
                    <p>Role {this.props.loggedUser.role.toUpperCase()}</p>
                    <p>Departement {this.props.loggedUser.departement.name}</p>
                </Card>

                <Card title="Daftar Notulen Rapat">

                    {/* record list */}
                    {navButtons}
                    <form id="list-form" onSubmit={(e) => { e.preventDefault(); this.filter(e.target) }}>
                        <button type="reset" className="button is-danger">
                            <span className="icon">
                                <i className="fas fa-sync"></i>
                            </span>
                            <span>Reset Filter</span>
                        </button>
                        <button type="submit" onClick={this.onSubmitClick} className="button is-info">
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
                                    { text: 'date', withFilter: true },
                                    { text: 'content', withFilter: true },
                                    { text: 'decision', withFilter: true },
                                    { text: 'deadline_date', withFilter: true },
                                    { text: 'departement', withFilter: true },
                                    { text: 'status', },
                                    { text: 'action', },
                                ]} />
                            {meetingNoteList.map((item, i) => {
                                const indexBegin = (this.page - 1) * this.limit;
                                return (<tr>
                                    <td>{indexBegin + i + 1}</td>
                                    <td>{item.id}</td>
                                    <td>{item.date}</td>
                                    <td>{item.content && item.content.length > 10 ? item.content.substring(0, 10) + '...' : item.content}</td>
                                    <td>{item.decision && item.decision.length > 10 ? item.decision.substring(0, 10) + '...' : item.decision}</td>
                                    <td>{item.deadline_date}</td>
                                    <td>{item.departement.name}</td>
                                    <td>-</td>
                                    <td>
                                        <Link to={"/meetingnote/" + item.id} className="button is-link" >
                                            view
                                    </Link>
                                    </td>
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