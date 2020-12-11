import  React  from 'react';
import { contextPath } from './../../constant/Url';

export const AnchorWithIcon = (props) => {
    const className = props.className;
    const iconClassName = props.iconClassName;
    if (props.show == false)  return null;
    return (
        <a className={"button " +className} style={props.style} onClick={props.onClick}>
            <span className="icon">
                <i className={iconClassName}></i>
            </span>
            <span>{props.children}</span>
        </a>
    )
}

export const AttachmentLink = (props) => {
    const link = contextPath()+ props.to;
    return (
        <a href={link} target="_blank" className={"button is-small"} style={props.style}  >
            <span className="icon">
                <i className="fas fa-link"></i>
            </span>
            <span>Open</span>
        </a>
    )
}