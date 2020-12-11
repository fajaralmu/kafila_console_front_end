
import { TOPIC_PREFIX } from './componentHelper';
export const extractMeetingNoteObjectToTempData = (meetingNote) => {
    const tempData = {};
    for (const key in meetingNote) {
        if (meetingNote.hasOwnProperty(key)) {
            const element = meetingNote[key];
            if (key == ("discussion_topics")) {
                continue;
            }
            tempData[key] = element;
        }
    }
    if (meetingNote.discussion_topics)
        for (let i = 0; i < meetingNote.discussion_topics.length; i++) {
            const discussion_topic = meetingNote.discussion_topics[i];
            for (const key in discussion_topic) {
                if (discussion_topic.hasOwnProperty(key)) {
                    const element = discussion_topic[key];
                    let prefixedKey = TOPIC_PREFIX + discussion_topic.id + "_" + key;
                    tempData[prefixedKey] = element;
                }
            }
        }
    return tempData;
}
export const enableAllInputs = (inputs) => {
    if (null == inputs) return;
    for (let i = 0; i < inputs.length; i++) {
        const element = inputs[i];
        element.removeAttribute("disabled");
    }
}
export const getArrayIndexWithValue = (array, value) => {
    for (let i = 0; i < array.length; i++) {
        if (array[i] == value) {
            return i;
        }
    }
    return null;
}
export const mergeObject = (original, toMerge) => {
    for (const key in toMerge) {
        if (toMerge.hasOwnProperty(key)) {
            const element = toMerge[key];
            original[key] = element;
        }
    }
}
export const extractInputValues = (inputs) => {
    const values = {};
    for (let i = 0; i < inputs.length; i++) {
        const element = inputs[i];
        const name = element.name;
        if (element.value == null || element.value == "") {
            continue;
        }
        if (element.type == 'file') {
            //
        } else {
            values[name] = element.value;
        }
    }
    
    console.debug("SAVED TEMP: ", values);
    return values;
}
export const populateInputs = (inputs, object, disabled = false) => {
    console.debug("setTempDiscussionTopicValues: ", object);
            
    for (let i = 0; i < inputs.length; i++) {
        const element = inputs[i];
        if (element.type == 'file') continue;
        if (null != object[element.name]) {
            element.value = object[element.name];
        } else {
            element.value = null;
        }

        if (disabled) {
            element.setAttribute("disabled", "disabled");
        }
    }
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


export const deleteArrayValueWithKeyStartedWith = (object, prefix) => {
    for (const key in object) {
        if (object.hasOwnProperty(key)) {
            if (key.startsWith(prefix)) {
                delete object[key];
            }
        }
    }
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

export const extractMeetingNoteObject = (inputs) => {
    const meetingNote = { discussion_topics: [] };
    let currentDiscussionTopicID = -1;
    let currentDiscussionTopicIndex = -1;
    for (const key in inputs) {
        const value = inputs[key];
        if (key.startsWith(TOPIC_PREFIX)) {
            const indexAndName = extractTopicDiscussionIndexAndName(key);
            if (indexAndName.index != currentDiscussionTopicID) {
                meetingNote.discussion_topics.push({});
                currentDiscussionTopicID = indexAndName.index;
                currentDiscussionTopicIndex++;
            }
            if (value.isFile == true) {
                meetingNote.discussion_topics[currentDiscussionTopicIndex][indexAndName.name + "_info"] = value;
            } else {
                meetingNote.discussion_topics[currentDiscussionTopicIndex][indexAndName.name] = value;
            }
        } else {
            meetingNote[key] = value;
        }
    }

    return meetingNote;

}