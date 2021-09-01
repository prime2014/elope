import React, { Component } from 'react';
import NavbarUi from '../../common/Navbar.ui';
import PageBanner from '../../common/page_banner';
import { connect } from "react-redux";
import PropTypes from "prop-types";
import toast, { Toaster } from "react-hot-toast";
import { accountsAPI } from "../../services/accounts/accounts.service";


class EmailConfirmation extends Component {


    componentDidMount(){
        if (!Object.values(this.props.user).length){
            this.props.history.goBack()
        }
    }

    resendEmailLink = () => {
        toast.promise(accountsAPI.resendActivationLink(this.props.user.id),{
            loading: "Resending the link...",
            success: (data)=>{
                return Object.values(data);
            },
            error: "There was a problem resending the link"
        },
        {
            style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
            },
        })
    }
    render() {
        let { user } = this.props;
        return (
            <React.Fragment>
            <Toaster />
            <NavbarUi>
               <PageBanner>
                   <h2>Email Notification</h2>
                   <p>Home | Congratulations</p>
               </PageBanner>
               <main>
                   <div className="msg-card my-2 mx-auto">
                    <h4>Congratulations!</h4>
                    <div className="msg-body">
                        <h5>Hello {user.first_name} {user.last_name};</h5>
                        <p>Congratulations on creating an account. We have sent you an account activation link to your email
                            <span className="mail"> {user.email}</span>. In order to activate your account, you need to click the link in that email, or paste it
                            in your browser, and follow the instructions thereafter.
                        </p>
                        <p>Thank you!</p>
                    </div>
                    <div className="resend-link">
                        <span>Did not receive an activation link</span>
                        <button disabled={!Object.values(user).length} onClick={this.resendEmailLink}>Resend Link</button>
                    </div>
                   </div>
               </main>
            </NavbarUi>
            </React.Fragment>
        )
    }
}

EmailConfirmation.propTypes = {
    user: PropTypes.object
}

const mapStateToProps = (state) => {
    return {
        user: state.signUp.user
    }
}

export default connect(mapStateToProps, null)(EmailConfirmation)

