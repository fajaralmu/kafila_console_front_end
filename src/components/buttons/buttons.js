import  React  from 'react';

export const AnchorWithIcon = (props) => {
    const className = props.className;
    const iconClassName = props.iconClassName;
    return (
        <a className={"button " +className} style={props.style} onClick={props.onClick}>
            <span className="icon">
                <i className={iconClassName}></i>
            </span>
            <spam>{props.children}</spam>
        </a>
    )
}