
import React, { Component } from 'react';
import { CommonTitle } from '../../BaseComponent';
import BaseComponent from '../../BaseComponent';
import Card from '../../container/Card';
import { InputField, SubmitResetButton } from '../../forms/commons';
import { issue_sources } from './IssuesForm';
import { SelectField } from './../../forms/commons';
import IssuesService from './../../../services/IssuesService';
import { AnchorWithIcon } from './../../buttons/buttons';
const ADDITION = "+";
const SUBSTRACTION = "-";
export default class IssueFormPublic extends BaseComponent {
    constructor(props) {
        super(props, false);
        this.state = {
            ...this.state,
            captchaUpdate: new Date(),
            recordSave: false,
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
            this.resetCaptcha();
            this.setState({ recordSaved: true });
        }

        this.recordFailedToSave = (e) => {
            this.showError("Gagal menyimpan aduan: " + e);
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

        this.showForm = () => {
            this.setState({ recordSaved: false });
        }
    }

    componentDidMount() {
        document.title = "Aduan Publik";
        this.loadDepartements();
        this.resetCaptcha();
    }

    componentDidUpdate() { }

    render() {
        const title = this.title("Form Pengaduan Publik");
        if (this.state.recordSaved == true) {

            return (
                <div>
                    {title}
                    <div className="box has-text-success" style={{ textAlign: 'center', margin: '10px' }}>
                        <span className="icon" style={{ fontSize: '4em', marginTop: '30px' }}><i className="fas fa-check" /></span>
                        <h2>Aduan Anda berhasil disimpan!</h2>
                        <AnchorWithIcon onClick={this.showForm} >Kirim Tanggapan Lain</AnchorWithIcon>
                    </div>
                </div>);
        }

        return (
            <div >
                {title}
                <Card title="Formulir">
                    <form onSubmit={this.onSubmit}>
                        <InputField name="date" label="tanggal" type="date" required={true} />
                        <InputField name="email" type="email" note="Kosongkan jika berstatus anonim" />
                        <SelectField label="status_pengadu" options={issue_sources.map(source => {
                            return {
                                value: source,
                                text: source
                            }
                        })} name="issuer" required={true} />
                        <InputField name="place" label="lokasi" required={true} />
                        <SelectField label="bidang" options={this.departementList.map(item => {
                            return {
                                value: item.id,
                                text: item.name
                            }
                        })} name="departement_id" required={true} />
                        <InputField name="content" label="aduan" type="textarea" required={true} />
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

class CaptCha extends Component {
    constructor(props) {
        super(props);
        this.canvas_id = "captcha_canvas_"+new Date().getTime();
    }
    getCaptchaText() {
        const captcha = this.props.captcha;
        const text = captcha.firstNumber + " " + captcha.operator + " " + captcha.secordNumber;
        return text;
    }
    drawCanvas() {
        const canvas = document.getElementById(this.canvas_id);
        const context = canvas.getContext('2d');

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = '#000';
        context.font = '70px Arial';
        context.fillText(this.getCaptchaText(), 10, 50);
    }
    componentDidUpdate() {
        this.drawCanvas();
    }
    componentDidMount() {
        this.drawCanvas();
    }
    render() {
        const captcha = this.props.captcha;
        return (

            <article style={{ width: '100%' }} className="message ">
                <div className="message-header has-background-grey-lighter">
                    <p className="has-text-dark">Captcha</p>
                    <a onClick={this.props.reset} className="button"><i className="fas fa-sync" /></a>
                </div>
                <div className="message-body has-background-light">
                    <canvas id={this.canvas_id} className="has-background-light" style={{ width: '100px', height: 'auto' }} />
                    <input className="input" name="captcha_result" required />
                </div>
            </article>
        );
    }
}