
import React from 'react';

import { Route, Switch, withRouter, Link } from 'react-router-dom'
import * as actions from '../../../redux/actions/actionCreators'
import { connect } from 'react-redux'
import BaseComponent, { CommonTitle } from '../../BaseComponent';
import Card from '../../container/Card';
import PieChart from './PieChart';
import RecordHistoriesService from './../../../services/RecordHistoriesService';
import { AnchorWithIcon } from './../../buttons/buttons';
import Message from './../../messages/Message';
import { DATA_KEY_DEPARTEMENTS } from './../../../constant/ApplicationDataKeys';
import { SubmitResetButton, SelectField } from '../../forms/commons';

class Statistic extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            errorLoadingStatistic: false
        };
        this.pieChartChild = React.createRef();
        this.historiesService = RecordHistoriesService.instance;
        this.statisticData = null;
        this.departementList = [];

        this.loadStatisticWithDepartement = (e) => {
            e.preventDefault();
            const input = document.getElementById("input-form-field-departement");
            const departement_id = input.value;
            if (departement_id == 'all') {
                this.loadStatistic(null);
                return;
            }
            this.loadStatistic(departement_id);
        }

        this.statisticLoaded = (response) => {
            this.statisticData = response;
            if (this.pieChartChild.current) {
                this.pieChartChild.current.resetProportion();
            }

            if (this.isLoggedUserAdmin()) {
                this.departementList = response.statistic.departements;
                this.props.storeApplicationData(DATA_KEY_DEPARTEMENTS, this.departementList);
            }
        }

        this.statisticFailedToLoad = (e) => {
            console.error(e);
            this.setState({ errorLoadingStatistic: true });
        }
        this.loadStatistic = (departement_id = null) => {
            this.setState({ errorLoadingStatistic: false });
            this.commonAjax(
                this.historiesService.getStatistic, departement_id,
                this.statisticLoaded,
                this.statisticFailedToLoad,
            )
        }
    }

    getProportionData = () => {
        if (this.statisticData == null) { return null }
        const statistic = this.statisticData.statistic;
        const total_topic = statistic.topic_count;
        const proportions = [
            {
                proportion: statistic.topic_closed_count / total_topic,
                label: 'Closed',
                color: 'green',
                value: statistic.topic_closed_count
            },
            {
                proportion: statistic.topic_not_closed_count / total_topic,
                label: 'Not Closed',
                color: 'orange',
                value: statistic.topic_not_closed_count
            }
        ]
        return proportions;
    }

    componentDidMount() {
        if (null == this.state.statisticData) {
            this.loadStatistic();
        }
    }

    render() {
        if (null == this.isLoggedUserNull()) {
            return null;
        }
        if (this.state.errorLoadingStatistic) {
            return (<Card title="Statistik">
                <ErrorInfo onClick={this.loadStatistic} /></Card>);
        }
        const proportions = this.getProportionData();
        if (null == proportions) {
            return <Card title="Statistik"><p>Please Wait</p></Card>
        }
        const departementListMapped = this.departementList.map(function (d) {
            return {
                value: d.id,
                text: d.name
            }
        });
        const departementOptions = [{value:'all', text: '-- Semua --'},...departementListMapped];
        return (

            <Card title="Statistik">
                {this.isLoggedUserAdmin() ?
                    <form onSubmit={this.loadStatisticWithDepartement}>
                        <SelectField name="departement" options={
                            departementOptions} />
                        <SubmitResetButton />
                    </form> :
                    null}
                <div id="pie_chart_discussion_topics">
                    <PieChart title="Tema Pembahasan" ref={this.pieChartChild} proportions={proportions} />
                    <AnchorWithIcon style={{ marginTop: '20px' }} iconClassName="fas fa-sync" onClick={this.loadStatistic}>
                        Reload
                                </AnchorWithIcon>
                    <p>updated at: {this.statisticData.date}</p>
                </div>
            </Card>
        )
    }
}
const ErrorInfo = (props) => {

    return (
        <Message enableHidden={false} className="is-danger" header="Gagal Memuat Data">
            <AnchorWithIcon onClick={props.onClick} iconClassName="fas fa-sync">Muat Ulang</AnchorWithIcon>
        </Message>
    )
}
const mapStateToProps = state => {

    return {
        loggedUser: state.userState.loggedUser,
        loginStatus: state.userState.loginStatus,
        applicationData: state.applicationState.applicationData
    }
}
const mapDispatchToProps = dispatch => ({
    storeApplicationData: (code, data) => dispatch(actions.applicationAction.storeApplicationData(code, data)),
})

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(Statistic));