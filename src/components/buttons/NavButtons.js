
import React, { Component, Fragment } from 'react';
import { uniqueId } from './../../utils/StringUtil';

class NavButtons extends Component {
    constructor(props) {
        super(props);
        this.id = uniqueId();

        this.onClick = (index) => {
            if (this.props.onClick) {
                this.props.onClick(index);
            }
        }
    }

    render() {
        const buttonValues = generateButtonValues(this.props.limit, this.props.totalData, this.props.activeIndex);
        const buttonsData = [];
        let maxIndex = 1;
        for (let i = 0; i < buttonValues.length; i++) {
            const element = buttonValues[i];
            buttonsData.push({
                index: element,
            });
            maxIndex = element;
        }

        return (
            <div className="columns">
                <div className="column has-text-centered">
                    <div className='buttons'>
                    {buttonsData.map((data, i) => {
                        const className = data.index == this.props.activeIndex ? "button is-small is-link" : "button is-small is-light";
                        return (
                            <a key={"nav_btn_" + i} onClick={() => { this.onClick(data.index) }} className={className}>{data.index}</a>
                        )
                    })}
                    </div>
                    <p className="tags has-addons">
                        <span className="tag is-link">Record Per Page</span>
                        <span className="tag is-light">{this.props.limit}</span>
                    </p>
                </div>
                <div className="column control">
                    <InputHasIconLeft iconClassName="fas fa-directions" style={{ marginBottom: '5px' }} name="input-page" placeholder="go to page" className="input is-small" min="1" id={"custom_page_" + this.id} type="number" />
                    <InputHasIconLeft iconClassName="fas fa-border-all" name="input-record-count" placeholder="display per page" className="input is-small" min="1" id={"custom_page_" + this.id} type="number" />

                </div>
            </div>
        )
    }

}

const InputHasIconLeft = (props) => {
    const iconClassName = props.iconClassName ? props.iconClassName:"fas fa-exclamation-circle";
    return (
        <div className="control has-icons-left">
            <input {...props} />
            <span className="icon is-small is-left">
                <i className={iconClassName}></i>
            </span>
        </div>
    )
}

const generateButtonValues = (limit, totalData, currentPage) => {

    /* DISPLAYED BUTTONS */
    const displayed_buttons = [];
    const buttonCount = Math.ceil(totalData / limit);

    // console.debug("current page:", currentPage);
    const min = parseInt(currentPage) - 2;
    const max = parseInt(currentPage) + 2;

    // console.debug("min", min, "current page:", currentPage, "max", max);
    if (buttonCount > 1) {
        displayed_buttons.push(1);
    }
    for (let i = min; i <= max; i++) {
        if (i > 1 && i <= buttonCount) {
            (displayed_buttons.push(i));
        }
    }
    if (max < buttonCount) {
        displayed_buttons.push(buttonCount);
    }
    return displayed_buttons;
}

export default NavButtons;