
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

        this.filter = (form) => {
            const inputs = form.getElementsByClassName("form-filter");
             
            this.fieldsFilter = {};
            for (let i = 0; i < inputs.length; i++) {
                const element = inputs[i];
                if (null != element.value && "" != element.value) {
                    this.fieldsFilter[element.name] = element.value;
                }
            }
             
            this.getMeetingNotes();
        }
        this.onSubmitClick = (e) => {
            e.preventDefault();
            this.filter(document.getElementById("list-form"));
        }
    }
    componentWillMount(){
        this.validateLoginStatus();
        
    }
    componentDidMount()
    {
        if (null == this.props.meetingNoteData) {
            this.getMeetingNotes();
        }
        document.title = "Dashboard";
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
                <h2 style={{textAlign: 'center'}}>Dashboard</h2>
                <p>Hello {this.props.loggedUser.display_name}</p>
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
                    <tr>
                        <th>No</th>
                        <th>Id <Input name='id' /></th>
                        <th>Waktu <Input name='time' /></th>
                        <th>Pembahasan <Input name='content' /></th>
                        <th>Keputusan <Input name='decision' /></th>
                        <th>Deadline <Input name='deadline_date' /></th>
                        <th>Departemen <Input name='departement' /></th>
                        <th>Status <Input name='status' /></th>
                    </tr>
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
               <button className="button is-dark" onClick={this.getMeetingNotes} >Reload</button>
            </div>
        )
    }
}

const Input = (props) => {
    return <input className="input form-filter" type={props.type? props.type : 'text'} name={props.name} id={'input-'+props.name} />
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