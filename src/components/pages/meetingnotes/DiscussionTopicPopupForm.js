import React from 'react'
import BaseComponent from '../../BaseComponent';
import Card from './../../container/Card';
import { SubmitResetButton, InputField } from '../../forms/commons';
import { ModalBackdrop } from './../../messages/Alert';
import DiscussionTopicsService from './../../../services/DiscussionTopicsService';
const CLASS_INPUT_FIELD = "input-form-field";
export default class DiscussionTopicPopupForm extends BaseComponent
{
    constructor(props){
        super(props);
        this.discussionTopicService = DiscussionTopicsService.instance;
        this.onSubmitDiscussionTopic = (e) => {
            e.preventDefault();
            const form = e.target;

            if (!window.confirm("Submit Data?")) {
                return;
            }
            const inputs = form.getElementsByClassName(CLASS_INPUT_FIELD);
            const discussionTopic = {
                note_id: this.props.meetingNote.id
            };
            for (let i = 0; i < inputs.length; i++) {
                const element = inputs[i];
                discussionTopic[element.name] = element.value;
            }
            console.debug("SUBMIT:", discussionTopic);
            this.storeDiscussionTopic(discussionTopic);
        }
        this.storeDiscussionTopic = (discussionTopic) => {
            this.commonAjax(this.discussionTopicService.store, discussionTopic,
                this.discussionTopicSaved, this.handleErrorSubmitDiscussionTopic);
        }
        this.discussionTopicSaved = (response) => {
            alert("Success");
            this.props.onSuccess(response);
            // this.loadRecord();

        }
        this.handleErrorSubmitDiscussionTopic = (e) => {
            alert("Error Update Discussion Topic: " + e);
        }

    }

    render() {
        if (this.props.show == false || this.props.meetingNote == null) {
            return null;
        }
        return (
            <ModalBackdrop >
            <div className="container">
                <Card title="Tambah Tema Pembahasan"
                    headerIconClassName="fas fa-times"
                    headerIconOnClick={this.props.onClose}
                >   
                    <div style={{overflow:'scroll'}}>
                    <form onSubmit={this.onSubmitDiscussionTopic}>
                        <InputField className="discussion-topic" required={true} label="Pembahasan" name={"content"} type="textarea" />
                        <InputField className="discussion-topic" required={true} label="Keputusan" name={"decision"} type="textarea" />
                        <InputField className="discussion-topic" required={true} label="Deadline" name={"deadline_date"} type="date" />
                        <InputField className="discussion-topic" required={true} label="Penganggung Jawab" name={"person_in_charge"} />
                        <SubmitResetButton />
                   
                    <div className="level">
                        <div className="level-left">
                        <a className="button" onClick={this.props.onClose}>Close</a>
                        </div>
                    </div>
                    </form> 
                    </div>
                </Card>
            </div>
        </ModalBackdrop>
        )
    }
}
