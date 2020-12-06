
import React, { Component } from 'react';
import { CommonTitle } from '../../BaseComponent';
import BaseComponent from '../../BaseComponent';
import Card from '../../container/Card';
import { InputField, SubmitResetButton } from '../../forms/commons';
import { issue_sources } from './IssuesForm';
import { SelectField } from './../../forms/commons';
import IssuesService from './../../../services/IssuesService';
const ADDITION = "+";
const SUBSTRACTION = "-";
export default class IssueFormPublic extends BaseComponent {
    constructor(props) {
        super(props, false);
        this.state = {
            ...this.state,
            captchaUpdate: new Date()
        }
        this.issueService = IssuesService.instance;
        this.departementList = [];
        this.captcha = {
            firstNumber: 1,
            secordNumber: 2,
            operator: ADDITION,
            updatedAt: new Date()
        };

        this.resetCaptcha = () => {
            this.captcha.firstNumber = Math.floor(Math.random() * 10) + 1;
            this.captcha.secordNumber = Math.floor(Math.random() * 10) + 1;
            this.captcha.operator = this.captcha.firstNumber % 2 == 0 ? ADDITION : SUBSTRACTION;
            this.captcha.updatedAt = new Date();
            this.setState({ captchaUpdate: this.captcha.updatedAt });
        }

        this.validateCaptcha = (value) => {
            const number1 = this.captcha.firstNumber;
            const number2 = this.captcha.secordNumber;
            if (this.captcha.operator == ADDITION) {
                return number1 + number2 == value;
            } else if (this.captcha.operator == SUBSTRACTION) {
                return number1 - number2 == value;
            }
            return false;
        }

        this.onSubmit = (e) => {
            e.preventDefault();
            const form = e.target;
            const capchaResult = document.getElementsByName("captcha_result")[0].value;
            const captchaValidated = this.validateCaptcha(capchaResult);
            const app = this;
            if (!captchaValidated) {
                
                this.showError("Invalid Captcha");
                return;
            }
            this.showConfirmation("Submit Data?").then(function (ok) {
                if (ok) {
                    app.fillDataAndStore(form);
                }
            });
        }

        this.fillDataAndStore = (form) => {
            const issue = {};
            const inputs = form.getElementsByClassName("input-form-field");
            for (let i = 0; i < inputs.length; i++) {
                const element = inputs[i];
                issue[element.name] = element.value
            }
            console.debug("Issue: ", issue);
            this.storeIssue(issue);
        }

        this.departementListLoaded = (response) => {
            this.departementList = response.result_list;
        }
        this.departementListNotLoaded = (error) => {
            const app = this;
            this.showConfirmationDanger("Error loading data.. please try or reload the page")
                .then(function (ok) {
                    if (ok) {
                        app.loadDepartements();
                    }
                })
        }

        this.recordSaved = (response) => {
            this.showInfo("Berhasil menyimpan aduan");
        }

        this.recordFailedToSave = (e) => {
            this.showError("Gagal menyimpan aduan: "+e);
        }

        this.loadDepartements = () => {
            this.commonAjax(
                this.issueService.departementList, {},
                this.departementListLoaded,
                this.departementListNotLoaded
            );
        }

        this.storeIssue = (issue) => {
            this.commonAjax(
                this.issueService.storePublicIssue, issue,
                this.recordSaved,
                this.recordFailedToSave
            );
        }
    }

    componentDidMount() {
        document.title = "Aduan Publik";
        this.loadDepartements();
        this.resetCaptcha();
    }

    componentDidUpdate() { }

    render() {
        return (
            <div>
                <CommonTitle>Form Pengaduan Publik</CommonTitle>
                <Card title="Formulir">
                    <form onSubmit={this.onSubmit}>
                        <InputField name="date" type="date" required={true} />
                        <InputField name="email" type="email" note="Kosongkan jika berstatus anonim" />
                        <SelectField label="status_pengadu" options={issue_sources.map(source => {
                            return {
                                value: source,
                                text: source
                            }
                        })} name="issuer" required={true} />
                        <InputField name="place" required={true} />
                        <SelectField label="Bidang" options={this.departementList.map(item => {
                            return {
                                value: item.id,
                                text: item.name
                            }
                        })} name="departement_id" required={true} />
                        <InputField name="content" type="textarea" required={true} />
                        <div className="field is-horizontal">
                            <div className="field-label"></div>
                            <div className="field-body">
                                <CaptCha reset={this.resetCaptcha} captcha={this.captcha} />
                            </div>
                        </div>
                        <SubmitResetButton />
                    </form>
                </Card>
            </div>
        )
    }
}

const CaptCha = (props) => {
    const captcha = props.captcha;
    return (
        
        <article style={{width:'100%'}} className="message is-link">
            <div className="message-header">
                <p>Captcha</p>
                <a onClick={props.reset} className="button"><i className="fas fa-sync" /></a>
            </div>
            <div className="message-body has-background-grey-lighter">
                <h2>{captcha.firstNumber} {captcha.operator} {captcha.secordNumber} = </h2>
                <input className="input" name="captcha_result" required />
            </div>
        </article>
    );
}