import React, { Component } from "react";
import NavbarUi from "../../common/Navbar.ui";
import PageBanner from "../../common/page_banner";
import { connect } from "react-redux";
import { Base64 } from "js-base64";
import { ProgressBar } from 'primereact/progressbar';
import { accountsAPI } from "../../services/accounts/accounts.service";
import { Button } from 'primereact/button';
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

class AccountActivation extends Component {
    constructor(props){
        super(props);
        this.state = {
            token: "",
            user:{},
            loading: false
        }
    }

    componentDidMount(){
        let id = Base64.atob(`${this.props.match.params.id}`);
        let token = this.props.match.params.token;
        accountsAPI.getUser(id).then(resp=>{
            this.setState({
                user:{...resp},
                token
            })
        })
    }

    handleActivateAccount = event => {
        let { user, token } = this.state;
        this.setState({
            loading:true
        },()=>{
            toast.promise(accountsAPI.activateUserAccount(user.id, token),
            {
                loading: "Activating your account...",
                success: (data)=>{
                    console.log(data);
                    this.setState({ loading: false })
                    if(data === "success") return "Your Account was successfully activated";
                    return "This link has expired";
                },
                error: (err)=>{
                    this.setState({ loading: false })
                    return "Your account activation failed"
                }
            },
            {
                style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
                },
            });
        })
    }

    render(){
        let { cart } = this.props;
        let { user } = this.state;

        return(
            <React.Fragment>
            <Toaster />
            <NavbarUi cart = {cart.length ? cart : []}>
                <PageBanner>
                    <h2>Account Activation</h2>
                    <p>Home | Activate Account</p>
                </PageBanner>
                <div className="activation-template">
                    {Object.keys(this.state.user).length ?
                        <>

                            <div className="card">
                                <h5 className="namelet px-4 py-2">Hi {user.first_name} {user.last_name}</h5>
                                <div className="p-4">
                                    <p className="my-0">Thank you for registering an account with us.</p>
                                    <p className="my-0">To activate your account click the button below.</p>
                                </div>
                                <div className="px-4 py-2">
                                    <Button onClick={this.handleActivateAccount} className="activate-btn" loading={this.state.loading} label={this.state.loading ? "Activating..." : "Activate Account"} loadingOptions={{ 'position': 'right' }}/>
                                </div>
                                <div className="namelet px-4 py-2">
                                    <p className="contactq">For more information? <Link to="/contact-us">Contact Us</Link></p>
                                </div>
                            </div>
                        </> :
                        <>
                            <ProgressBar mode="indeterminate" />
                            <h4 className="text-center">Processing</h4>
                        </>
                    }
                </div>
            </NavbarUi>
            </React.Fragment>
        )
    }
}


const mapStateToProps = (state, ownProps) => {

    return {
        cart: state.cartItems.cart,
    }

}


export default connect(mapStateToProps, null)(AccountActivation);
