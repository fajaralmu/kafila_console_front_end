
import BaseComponent from '../BaseComponent';
export default class BaseAdminPage extends BaseComponent
{

    componentDidUpdate() {
        if (this.props.loginStatus == false ||
            this.props.loggedUser == null ||
            this.props.loggedUser.role != 'admin'
            ) {
            this.backToLogin();
        }
    }
}