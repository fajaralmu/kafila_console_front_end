import { React , Component} from 'react';


export default class BaseComponent extends Component {
    constructor(props){
        super(props);
        this.parentApp = props.app; 
    

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

            method(params).then(function(response){
                if(successCallback){ 
                    successCallback(response);
                }
            }).catch(function(e){
                if(errorCallback){
                    errorCallback(e);
                } else {
                    if (typeof(e) == 'string'){
                        alert("Operation Failed: "+e);
                    }
                    alert("resource not found");
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
}
