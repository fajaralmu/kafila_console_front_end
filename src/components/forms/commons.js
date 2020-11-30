
import React, { Component } from 'react';
import './FormControls.css'

export const TableHeadWithFilter = (props) => {
    const headers = props.headers;
    const onButtonOrderClick = props.onButtonOrderClick;
    return (<thead>
        <tr>
            {headers.map(header => {
                return <th>{header.alias == null ? header.text.toUpperCase().replaceAll("_", " ") : header.alias}

                    {header.withFilter ?
                       <div class="field has-addons">
                       <div class="control">
                                <InputFormFilter type="text" name={header.text} />
                            </div>
                            <div class="control" style={{fontSize:'0.7em', backgroundColor:'#ccc'}}>
                                <i sort="asc" onClick={onButtonOrderClick} data={header.text} className="fas fa-angle-up sort-button"></i>
                                <i sort="asc" onClick={onButtonOrderClick}  data={header.text}  className="fas fa-angle-down sort-button"></i>
                            </div>
                           
                        </div>
                        : null}
                </th>
            })}
        </tr>
    </thead>)
}
//not exported
const InputFormFilter = (props) => {
    const className = "input form-filter";
    const type = props.type ? props.type : 'text';

    return <input className={className} type={type} name={props.name}
        id={'input-form-' + props.name} />
}

export const ButtonApplyResetFilter = (props) => {
    return (
        <>
            <div className="buttons has-addons">
            <button type="submit" className="button is-info">
                <span className="icon">
                    <i className="fas fa-search"></i>
                </span>
                <span>Apply Filter</span>
            </button>
            <button type="reset" className="button is-danger">
                <span className="icon">
                    <i className="fas fa-sync"></i>
                </span>
                <span>Reset Filter</span>
            </button>
            </div>
        </>
    )
}



export const InputField = (props) => {

    const className = "input input-form-field";
    return (
        <div className="field is-horizontal">
            <div className="field-label is-normal"><label className="label">{props.label ? props.label : "Input"}</label></div>
            <div className="field-body">
                <div className="field">
                    <div className="control">
                        {props.required == true ?
                            props.type == 'textarea' ?
                                <textarea required className={className + " textarea"} id={'input-form-field-' + props.name} name={props.name}></textarea>
                                :
                                <input required type={props.type ? props.type : 'text'} id={'input-form-field-' + props.name} name={props.name} className={className} />
                            :
                            props.type == 'textarea' ?
                                <textarea className={className + " textarea"} id={'input-form-field-' + props.name} name={props.name}></textarea>
                                :
                                <input type={props.type ? props.type : 'text'} id={'input-form-field-' + props.name} name={props.name} className={className} />
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export const SelectField = (props) => {
    const optionValues = props.options == null ? [] : props.options;
    const options = optionValues.map((option) => {
        return <option value={option.value} >{option.text}</option>
    })
    return (
        <div className="field is-horizontal">
            <div className="field-label is-normal"><label className="label">{props.label ? props.label : "Select"}</label></div>
            <div className="field-body">
                <div className="field">
                    <div className="control">
                        {props.required == true ?
                            <select required id={'input-form-field-' + props.name} name={props.name}
                                className="input input-form-field">
                                {options}
                            </select>
                            :
                            <select id={'input-form-field-' + props.name} name={props.name}
                                className="input input-form-field">
                                {options}
                            </select>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export const LabelField = (props) => {

    const className = "input";
    return (
        <div className="field is-horizontal">
            <div className="field-label is-normal"><label className="label">{props.label ? props.label : "Label"}</label></div>
            <div className="field-body">
                <div className="field">
                    <div className="control">
                    {props.children}
                    </div>
                </div>
            </div>
        </div>
    );
}

export const SubmitResetButton = (props) => {
    const submitValue = props.submitText ? props.submitText : "Submit";
    return (
        <div className="field is-horizontal">
            <div className="field-label is-normal" />
            <div className="field-body">
                <div className="field">
                    <button className="button is-link" type="submit" >
                        <span className="icon"><i className="fas fa-save"></i></span>
                        <span>{submitValue}</span>
                    </button>
                    {props.withReset == true ?
                        <button className="button is-danger" type="reset" >
                            <span className="icon">
                                <i className="fas fa-sync"></i>
                            </span>
                            <span>Reset</span>
                        </button> : null
                    }
                </div>
            </div>
        </div>
    )
}
