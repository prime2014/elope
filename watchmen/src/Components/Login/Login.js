import React, { Component } from "react";
import Navbar from "../../common/Navbar.ui";
import { Formik } from "formik";
import { Link } from "react-router-dom";
import { Button } from 'primereact/button';
import {Checkbox} from 'primereact/checkbox';
import { accountsAPI } from "../../services/accounts/accounts.service";
import { Messages } from 'primereact/messages';
import { setLoginCredentials } from "../../redux/actions";
import { connect } from "react-redux";
import cookie from "react-cookies";
import PageBanner from "../../common/page_banner";



class Login extends Component{

    constructor(props){
        super(props);
        this.state = {
            email: "",
            password: "",
            checked:false,
            loading:false
        };
        this.baseState = this.state;
    }

    handleEmail = (event) => {
        this.setState({
            email: event.target.value
        })
    }

    handlePassword = event => {
        this.setState({
            password: event.target.value
        })
    }

    handleCheckBox = event => {
        this.setState({
            checked: !this.state.checked
        })
    }

    handleSubmit = event => {
        let that = this;
        let { email, password, ...rest } = that.state;
        event.preventDefault();
        that.setState({
            loading:true
        }, ()=>{
            accountsAPI.loginUser({ email, password }).then(resp=>{
                console.log(resp);
                if(resp.token){
                    const expires = new Date()
                    expires.setDate(Date.now() + 1000 * 60 * 60 * 24 * 14)
                    cookie.save("authToken", resp.token, { path: "/", expires, maxAge: 1209600, domain: "127.0.0.1", httpOnly: false})
                    that.props.history.push("/products");
                } else {
                    that.setState({
                        loading:false
                    }, ()=>that.msgs1.show({severity: 'error',  detail: resp.data.error}))
                }
            }).catch(err=>{
                that.msgs1.show({severity: 'error', detail: `${err}`});
            })

        })
    }


    render(){
        let { cart } = this.props;
        return(
            <Navbar cart={ cart }>
                <PageBanner>
                    <h2>Login</h2>
                    <p>Home | Login</p>
                </PageBanner>
                <div className="login-form">

                             <form onSubmit={this.handleSubmit} autoComplete="off">
                               <div>
                                    <h1 className="headline">Login</h1>
                                    <Messages ref={(el) => this.msgs1 = el}></Messages>
                                    <Messages ref={(el) => this.msgs2 = el}></Messages>
                               </div>
                               <div className="email">
                                    <label htmlFor="email">Email*</label>
                                    <input
                                     type="email"
                                     name="email"
                                     onChange={this.handleEmail}
                                     value={this.state.email}
                                     placeholder="Please enter your email"
                                     required
                                   />
                                    <p>{/* errors.email && touched.email && errors.email */}</p>
                               </div>
                               <div className="password">
                                    <label htmlFor="password">Password*</label>
                                    <input
                                     type="password"
                                     name="password"
                                     onChange={this.handlePassword}
                                     value={this.state.password}
                                     placeholder="Please enter your password"
                                     required
                                   />
                                   <p>{/* errors.password && touched.password && errors.password */}</p>
                               </div>
                               <div className="login-bits">
                                   <span>Don't have an account? <Link to="/register">Create One</Link> </span>
                                   <span><Link to="/password-reset">Forgot Password?</Link></span>
                               </div>
                               <div className="remember-me">
                                    <Checkbox onChange={this.handleCheckBox} checked={this.state.checked}></Checkbox> Remember me
                               </div>
                               <Button className="login-btn" loading={this.state.loading} label={this.state.loading ? "Logging you in..." : "Login"} loadingOptions={{ 'position': 'right' }}/>
                             </form>

                </div>
            </Navbar>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        cart: state.cartItems.cart
    }
}

const mapDispatchToProps = {
    setLoginCredentials,
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
