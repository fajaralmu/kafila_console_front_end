
import BaseComponent from '../BaseComponent';
export default class BaseAdminPage extends BaseComponent
{
    constructor(props){
        super(props);
    }

    componentDidUpdate() {
        if (this.isLoggedUserNull() ||
            this.props.loggedUser.role != 'admin'
            ) {
            this.backToLogin();
        }
    }
}