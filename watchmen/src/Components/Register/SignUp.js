import React, { Component } from "react";
import { connect } from "react-redux";
import Navbar from "../../common/Navbar.ui";
import PageBanner from "../../common/page_banner";
import { Button } from 'primereact/button';
import {Checkbox} from 'primereact/checkbox';
import { Link } from "react-router-dom";
import { accountsAPI } from "../../services/accounts/accounts.service";
import toast, { Toaster } from "react-hot-toast";

class SignUp extends Component {
    constructor(props){
        super(props);
        this.state = {
            first_name: "",
            last_name: "",
            email: "",
            password: "",
            confirm_password: "",
            loading: false,
            checked: false
        }
        this.baseState = this.state;
    }

    handleFirstName = (event) => {
        this.setState({
            first_name: event.target.value
        })
    }

    handleLastName = event => {
       this.setState({
            last_name: event.target.value
       })
    }

    handleEmail = event => {
        this.setState({
            email: event.target.value
        })
    }

    handlePassword = event => {
        this.setState({
            password: event.target.value
        })
    }

    handleConfirmPassword = event => {
        this.setState({
            confirm_password: event.target.value
        })
    }

    handleCheckBox = (event) => {
        this.setState({
            checked: !this.state.checked
        })
    }

//    checks the passwords value against the confirm_password value
    validatePassword = () => this.state.password === this.state.confirm_password ? true : false;

    handleRegisterUser = (event) => {
        let {
            first_name,
            last_name,
            email,
            password,
            ...rest
        } = this.state;
        event.preventDefault();
        let check_password = this.validatePassword();
        if(check_password){
            this.setState({
                loading: true
            }, ()=> {

                toast.promise(accountsAPI.registerUser({ first_name, last_name, email, password }),
                    {
                        loading: "Registering User...",
                        success: (data)=>{
                            this.setState(this.baseState);
                            return "Account Registration Successful";
                        },
                        error: (err) => {
                            this.setState(this.baseState);
                            return "Account Registration Failed"
                        }
                    },
                    {
                       style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                        },
                    }
                )

            })
        }
    }

    render(){
        let { cart } = this.props;
        return(
           <React.Fragment>
               <div><Toaster /></div>
           <Navbar cart={ cart.length ? cart : [] }>
              <PageBanner>
                <h2>Sign Up</h2>
                <p>Home | Register</p>
              </PageBanner>
              <div className="login-form">
                <form onSubmit={this.handleRegisterUser} autoComplete="off">
                    <div>
                        <h1 className="headline">Sign Up</h1>
                    </div>
                    <div className="row">
                        <div className="col-md-6 pb-3">
                            <label htmlFor="first_name">First Name</label>
                            <input onChange={this.handleFirstName} type="text" name="first_name" placeholder="Enter your firstname" value={this.state.first_name}/>
                        </div>
                        <div className="col-md-6 pb-3">
                            <label htmlFor="last_name">Last Name</label>
                            <input onChange={this.handleLastName} type="text" name="last_name" placeholder="Enter your lastname" value={this.state.last_name}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12 pb-3">
                            <label htmlFor="email">Email</label>
                            <input onChange={this.handleEmail} type="email" name="email" placeholder="Enter your email" value={this.state.email} required/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12 pb-3">
                            <label htmlFor="password">Password</label>
                            <input onChange={this.handlePassword} type="password" name="password" placeholder="Enter your password" value={this.state.password} required/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12 pb-3">
                            <label htmlFor="confirm_password">Confirm Password</label>
                            <input onChange={this.handleConfirmPassword} type="password" name="password2" placeholder="Confirm your password" value={this.state.confirm_password} required/>
                        </div>
                    </div>
                    <div className="remember-me">
                        <Checkbox onChange={this.handleCheckBox} checked={this.state.checked}></Checkbox>I have read and agree to the
                        <Link to="/terms-and-conditions"> terms &amp; conditions</Link>
                    </div>
                    <Button className="login-btn" loading={this.state.loading} label={this.state.loading ? "Registering User..." : "Register"} loadingOptions={{ 'position': 'right' }}/>
                </form>
              </div>
           </Navbar>
           </React.Fragment>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        cart: state.cartItems.cart,
    }
}

export default connect(mapStateToProps, null)(SignUp);
