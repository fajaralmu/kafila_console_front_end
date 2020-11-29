import { React , Component} from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom'

export default class BaseComponent extends Component {
    constructor(props){
        super(props);
        this.parentApp = props.app; 
    
        this.validateLoginStatus = () => {
            if (this.props.loginStatus != true || this.props.loggedUser == null) {
                this.backToLogin();
            }
        }

        this.showConfirmation = (body) => {
            return new Promise((resolve, reject) =>{
                const onYes = function(e) {
                    resolve(true);
                }
                const onNo = function(e) {
                    resolve(false);
                }
                this.parentApp.showAlert("Confirmation", body, false, onYes, onNo);
            });
            
        }
        this.showInfo = (body) => {
            this.parentApp.showAlert("Info", body, true, function(){});
        }

        this.backToLogin = () => {
            this.props.history.push("/login");
        }
        /**
         * 
         * @param {boolean} withProgress 
         */
        this.startLoading = (withProgress) => {
            this.parentApp.startLoading(withProgress);
        }

        this.endLoading = () => {
            this.parentApp.endLoading();
        }
        /**
         * 
         * @param {Function} method 
         * @param {any} params 
         * @param {boolean} withProgress 
         * @param {Function} successCallback 
         * @param {Function} errorCallback 
         */
        this.doAjax = (method, params, withProgress, successCallback, errorCallback) => {
            if(!method) {console.warn("Method Not Found! ");return}
            this.startLoading(withProgress);
            const app = this;

            method(params).then(function(response){
                if(successCallback){ 
                    successCallback(response);
                }
            }).catch(function(e){
                if(errorCallback){
                    errorCallback(e);
                } else {
                    if (typeof(e) == 'string'){
                        app.showInfo("Operation Failed: "+e);
                    }
                    app.showInfo("resource not found");
                }
            }).finally((e)=>{
                this.endLoading();
            })
        }

        /**
         * 
         * @param {Function} method 
         * @param {any} params 
         * @param {Function} successCallback 
         * @param {Function} errorCallback 
         */
        this.commonAjax = (method, params, successCallback, errorCallback) => {
            this.doAjax(method, params, false, successCallback, errorCallback);
        }
         /**
         * 
         * @param {Function} method 
         * @param {any} params 
         * @param {Function} successCallback 
         * @param {Function} errorCallback 
         */
        this.commonAjaxWithProgress = (method, params, successCallback, errorCallback) => {
            this.doAjax(method, params, true, successCallback, errorCallback);
        }
    }

    componentDidUpdate() {
        if (null == this.props.loggedUser) {
            this.backToLogin();
        }
    }
}
