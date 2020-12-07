
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

class Dashboard extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            errorLoadingStatistic: false
        };
        this.pieChartChild = React.createRef();
        this.historiesService = RecordHistoriesService.instance;
        this.statisticData = null;

        this.statisticLoaded = (response) => {
            this.statisticData = response;
            if (this.pieChartChild.current){
                this.pieChartChild.current.resetProportion();
            }
        }

        this.statisticFailedToLoad = (e) => {
            console.error(e);
            this.setState({ errorLoadingStatistic: true });
        }
        this.loadStatistic = () => {
            this.setState({ errorLoadingStatistic: false });
            this.commonAjax(
                this.historiesService.getStatistic, null,
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

    componentWillMount() {

        this.validateLoginStatus();
    }
    componentDidMount() {
        document.title = "Dashboard";
        if (null == this.state.statisticData) {
            this.loadStatistic();
        }
    }

    render() {
        if (null == this.isLoggedUserNull()) {
            return null;
        }
        const proportions = this.getProportionData();
        return (
            <div>
                <CommonTitle>Dashboard</CommonTitle>
                <Card title="Welcome" >
                    <p>{this.getLoggedUser().display_name}</p>
                    <p>Bidang {this.props.loggedUser.departement.name}</p>
                </Card>
                <Card title="Statistik">
                    {this.state.errorLoadingStatistic ?
                        <ErrorInfo onClick={(e) => this.loadStatistic()} />
                        : null == proportions ? <p>Please wait..</p> :
                            <div>
                                <PieChart ref={this.pieChartChild}  proportions={proportions} />
                                <AnchorWithIcon iconClassName="fas fa-sync" onClick={this.loadStatistic}>
                                    Reload
                                </AnchorWithIcon>
                                <p>updated at: {this.statisticData.date}</p>
                            </div>
                    }
                </Card>
            </div>
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
    }
}
const mapDispatchToProps = dispatch => ({

})

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(Dashboard));