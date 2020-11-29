
import React, {Component} from 'react';

export const TableHeadWithFilter = (props) => {
    const headers = props.headers;
    const onButtonOrderClick = props.onButtonOrderClick;
    return (<thead>
        <tr>
            {headers.map(header=>{
                return <th>{header.alias == null ? header.text.toUpperCase().replaceAll("_", " ") : header.alias}
                    
                    {header.withFilter?
                    <>
                    <InputFormFilter type="text" name={header.text}   />
                    <button sort="asc" data={header.text} onClick={onButtonOrderClick} className="button is-small">asc</button>
                    <button sort="desc" data={header.text} onClick={onButtonOrderClick} className="button is-small">desc</button>
                    </>
                    : null}
                </th>
            })}
        </tr>
    </thead>)
}
//not exported
const InputFormFilter = (props) => {
    const className = "input form-filter";
    const type = props.type? props.type : 'text';
    
    return <input className={className} type={type} name={props.name} 
        id={'input-form-'+props.name} />
}


export const InputField = (props) => {

    return (
        <div className="field is-horizontal">
            <div className="field-label is-normal"><label className="label">{props.label}</label></div>
            <div className="field-body">
                <div className="field">
                    <div className="control">
                        {props.required == true ?
                            props.type == 'textarea' ?
                                <textarea required className="input textarea input-meeting-note" id={'input-meeting-note-' + props.name} name={props.name}></textarea>
                                :
                                <input required type={props.type ? props.type : 'text'} id={'input-meeting-note-' + props.name} name={props.name} className="input input-meeting-note" />
                            :
                            props.type == 'textarea' ?
                                <textarea className="input textarea input-meeting-note" id={'input-meeting-note-' + props.name} name={props.name}></textarea>
                                :
                                <input type={props.type ? props.type : 'text'} id={'input-meeting-note-' + props.name} name={props.name} className="input input-meeting-note" />
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

