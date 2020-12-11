import React from 'react';
import { Link } from 'react-router-dom';
import Card from './../../container/Card';
import { SubmitResetButton, LabelField } from './../../forms/commons';
export const TOPIC_PREFIX = "discussion_topic_";

export const deleteArrayValueWithKeyStartedWith = (object, prefix) => {
    for (const key in object) {
        if (object.hasOwnProperty(key)) {
            if (key.startsWith(prefix)) {
                delete object[key];
            }
        }
    }
}
export const FormTitle = (props) => {

    return (<><Link to="/discussiontopics">Tema Pembahasan</Link>&nbsp;<i className="fas fa-angle-right"></i>&nbsp;
    Form
    </>)
}
export const isDiscussionTopicClosed = (meetingNote, id) => {
    if (null == meetingNote || null == meetingNote.discussion_topics) {
        return false;
    }
    for (let i = 0; i < meetingNote.discussion_topics.length; i++) {
        const element = meetingNote.discussion_topics[i];
        if (element.id == id && element.is_closed) {
            return true;
        }
    }
    return false;
}
export const getMaxDiscussionTopicID = (discussionTopicCount) => {
    let max = 0;
    for (let i = 0; i < discussionTopicCount.length; i++) {
        const element = discussionTopicCount[i];
        if (element > max) {
            max = element;
        }
    }
    return max;
}

export const extractTopicDiscussionIndexAndName = (elementName) => {
    const result = {
        index: 0,
        name: null,
    }
    let elementNameSplitKey = elementName.split(TOPIC_PREFIX);
    let elementNameSplitIndex = elementNameSplitKey[1].split("_");
    result.index = parseInt(elementNameSplitIndex[0]);
    result.name = elementName.split(TOPIC_PREFIX + result.index + "_")[1];
    return result;
}

export const ButtonRemoveTopic = (props) => {
    if (props.show == false) { return null; }
    return (
        <a className="button is-danger is-outlined" onClick={(e) => props.removeDiscussionTopic(props.id)}>
            <span className="icon"><i className="fas fa-times" /></span>
            <span>Remove</span>
        </a>
    )
}

export const DiscussionTopicStatusInfo = (props) => {
    const meetingNote = props.meetingNote;
    if (null == meetingNote) return null;
    const discussion_topics = meetingNote.discussion_topics;
    if (null == discussion_topics) return null;
    let closed = 0;
    for (let i = 0; i < discussion_topics.length; i++) {
        const element = discussion_topics[i];
        if (element.is_closed) {
            closed++;
        }
    }

    return (
        <table><tbody><tr >
            <td style={{ border: 'none' }}>
                <div className="tags has-addons are-small">
                    <span className="tag is-light">Closed</span>
                    <span className="tag is-info">{closed}</span>
                </div>
            </td><td style={{ border: 'none' }}>
                <div className="tags has-addons are-small">
                    <span className="tag is-light">Not Closed</span>
                    <span className="tag is-danger">{discussion_topics.length - closed}</span>
                </div></td>
        </tr></tbody></table>
    )
}

export const ButtonAddTopic = (props) => {
    return (
        <div className="has-text-centered">
            <a className="button is-primary is-outlined" onClick={props.addDiscussionTopic}
                style={{ marginTop: '10px', marginBottom: '10px' }}>
                <span className="icon">
                    <i className="fas fa-plus"></i>
                </span>
                <span>{"Tambah Tema Pembahasan"}</span>
            </a>
        </div>
    )
}

export const AttachmentInfo = (props) => {
    if (!props.show) { return null }
    return (<div className="tags has-addons">
        <span className="tag is-info">
            Attachment : {props.name}
        </span>
        <span className="tag is-warning" style={{cursor:'pointer'}} 
            onClick={props.onRemoveClick}>remove</span>
    </div>)
}

export const LinkEditAndAction = (props) => {
    if (props.show == false) return null;
    const id = props.id;
    return (
        <div className="buttons has-addons">
            <Link to={"/discussiontopics/" + id} className="button is-warning">
                <i className="fas fa-edit" />&nbsp;Edit
                </Link>
            <Link to={"/discussiontopics/" + id + "/action"} className="button is-primary">
                <i className="fas fa-location-arrow" />&nbsp;Konfirmasi
                </Link></div>
    )
}
export const ClosedInfoTag = (props) => {
    if (props.closed == true) {
        return <span className="tag is-primary"><i className="fas fa-check" />&nbsp;Closed</span>
    }
    return null;
}
export const FormUpperTag = (props) => {
    if (props.show == false || null == props.meetingNote) { return null }
    const meetingNote = props.meetingNote;
    return (
        <div style={{ marginBottom: '20px' }}>
            <div className="level">
                <div className="level-left" >
                    <DiscussionTopicStatusInfo meetingNote={meetingNote} />
                </div>
                <div className="level-right">
                    <span className="tag is-primary is-medium">{meetingNote.departement.name}</span>
                </div>
            </div>
        </div>
    );
}

export const LabelDiscussionTopicCount = (props) => {
    return (<LabelField label="Tema Pembahasan" >
        <span className="tag is-dark">
            <b>{props.count}</b></span>
    </LabelField>)
}

export const MeetingNoteSubmitResetField = (props) => {
    if (props.show == false) {
        return null;
    }
    return (
        <Card title="Action">
            <SubmitResetButton submitText={"Create"} withReset={true} />
        </Card>
    )
}
