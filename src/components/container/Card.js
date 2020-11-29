
import React, { Component } from 'react';
export default class Card extends Component {

    constructor(props) {
        super(props);

        this.saveButtonOnClick = (e) => {
            if (this.props.saveButtonOnClick) {
                this.props.saveButtonOnClick(e);
            }
        }
        this.editButtonOnClick = (e) => {
            if (this.props.editButtonOnClick) {
                this.props.editButtonOnClick(e);
            }
        }
        this.deleteButtonOnClick = (e) => {
            if (this.props.deleteButtonOnClick) {
                this.props.deleteButtonOnClick(e);
            }
        }
    }

    render() {
        return (
            <div class="card" style={{ margin: '10px', ...this.props.style}}>
                <header class="card-header">
                    <p class="card-header-title">
                        {this.props.title ? this.props.title : "Card Title"}
                    </p>
                    <a class="card-header-icon" aria-label="more options">
                        <span class="icon">
                            <i class="fas fa-angle-down" aria-hidden="true"></i>
                        </span>
                    </a>
                </header>
                <div class="card-content">
                    <div class="content">
                        {this.props.children}
                    </div>
                </div>
                {this.props.withButtonFooter ?
                    <footer class="card-footer">
                        <a href="#" onClick={this.saveButtonOnClick} class="card-footer-item">Save</a>
                        <a href="#" onClick={this.editButtonOnClick} class="card-footer-item">Edit</a>
                        <a href="#" onClick={this.deleteButtonOnClick} class="card-footer-item">Delete</a>
                    </footer>
                    : null
                }
                {this.props.footerContent ?
                    <footer class="card-footer">
                        {this.props.footerContent}
                    </footer>
                    :
                    null}
            </div>
        )
    }
}