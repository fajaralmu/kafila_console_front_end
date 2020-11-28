
import React, { Component } from 'react';

import { Route, Switch, withRouter, Redirect } from 'react-router-dom'
import * as actions from '../../redux/actionCreators'
import { connect } from 'react-redux'
import NavButtons from './../buttons/NavButtons';
class Dashboard extends Component {

    constructor(props){
        super(props);

        this.page = 1;
        this.limit = 5;
        this.count = 0;
        this.orderBy = 'id';
        this.orderType = 'asc';
        this.fieldsFilter = {};
        this.firstLoad = true;
        
        this.validateLoginStatus = () => {
            if (this.props.loginStatus != true || this.props.loggedUser == null) 
            {
                this.props.history.push("/login");
            }
        }

        this.getMeetingNotesByPage = (page) => {
            this.page = page;
            this.getMeetingNotes();
        }

        this.getMeetingNotes = () => {
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
            this.page = hasFilter ? filter.page:1;
            this.limit = hasFilter ? filter.limit:5;
            this.count = hasFilter ? filter.count:0;
        }

        this.filter = (form) => {
            const inputs = form.getElementsByClassName("form-filter");
             
            this.fieldsFilter = {};
            for (let i = 0; i < inputs.length; i++) {
                const element = inputs[i];
                if (null != element.value && "" != element.value) {
                    this.fieldsFilter[element.name] = element.value;
                }
            }
             
            this.page = 1;
            this.getMeetingNotes();
        }
        this.onSubmitClick = (e) => {
            e.preventDefault();
            this.filter(document.getElementById("list-form"));
        }

        this.populateDefaultInputs = () => {
            if (!this.firstLoad || null == this.props.meetingNoteData || null == this.props.meetingNoteData.filter) {
                return;
            }
            const fieldsFilter = this.props.meetingNoteData.filter.fieldsFilter;
            for (const key in fieldsFilter) {
                if (fieldsFilter.hasOwnProperty(key)) {
                    const element = fieldsFilter[key];
                    document.getElementById("input-form-"+key).value = element; 
                }
            }
        }
    }
    componentWillMount(){
        
        this.validateLoginStatus();
        this.initialize();
    }
    componentDidMount()
    {
        if (null == this.props.meetingNoteData) {
            this.getMeetingNotes();
        }
        document.title = "Dashboard";
        
        this.populateDefaultInputs();
        this.firstLoad = false;
    }

    createNavButton(){
        console.log("this.props.meetingNoteData: ", this.props.meetingNoteData);
        if (null == this.props.meetingNoteData) {
            
            return <></>
        }
        return <NavButtons onClick={this.getMeetingNotesByPage} limit={this.limit} 
            totalData={this.props.meetingNoteData.count} activeIndex={this.page} />
    }
    render(){
        if (null == this.props.loggedUser) {
            return null;
        }
        
        const meetingNoteData = this.props.meetingNoteData;
        const meetingNoteList = meetingNoteData ? meetingNoteData.result_list : [];
        const navButtons = this.createNavButton();
        console.debug("meetingNoteList: ", meetingNoteList);
        return (
            <div>
                <h2 style={{textAlign: 'center'}}>Dashboard {this.page}</h2>
                <p>Hello {this.firstLoad?'true':'false'} {this.props.loggedUser.display_name}</p>
                <p>Departement {this.props.loggedUser.departement.name}</p>
                <h3>Daftar Notulen Rapat</h3>
                {navButtons}
                <form id="list-form" onsubmit={(e)=> {e.preventDefault(); this.filter(e.target)}}>
                <input type="reset" className="button is-warning" value="Reset" />
                <button type="submit" onClick={this.onSubmitClick} className="button is-info">
                    <span className="icon">
                        <i className="fas fa-search"></i>
                    </span>
                    <span>Submit</span>
                    </button>
                <table style={{tableLayout: 'fixed'}} className="table">
                    <TableHeadWithFilter headers = {[
                        {text:'No'},
                        {text:'id', withFilter: true},
                        {text:'date', withFilter: true},
                        {text:'content', withFilter: true},
                        {text:'decision', withFilter: true},
                        {text:'deadline_date', withFilter: true},
                        {text:'departement', withFilter: true},
                        {text:'status',},
                    ]} />
                    {meetingNoteList.map((item, i)=>{
                        const indexBegin = (this.page-1) * this.limit;
                        return (<tr>
                            <td>{indexBegin+i+1}</td>
                            <td>{item.id}</td>
                            <td>{item.date}</td>
                            <td>{item.content}</td>
                            <td>{item.decision}</td>
                            <td>{item.deadline_date}</td>
                            <td>{item.departement.name}</td>
                            <td>-</td>
                        </tr>)
                    })}
               </table>
               </form>
            </div>
        )
    }
}

const TableHeadWithFilter = (props) => {
    const headers = props.headers;
    return (<thead>
        <tr>
            {headers.map(header=>{
                const input = header.withFilter == true ?
                    <Input type="text" name={header.text}   /> : null;
                return <th>{header.alias == null ? header.text.toUpperCase() : header.alias}
                    {input}
                </th>
            })}
        </tr>
    </thead>)
}

const Input = (props) => {
    const className = "input form-filter";
    const type = props.type? props.type : 'text';
    
    return <input className={className} type={type} name={props.name} 
        id={'input-form-'+props.name} />
}

const mapStateToProps = state => {
    console.log(state);
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