import React, { Component } from "react";
import Navbar from "../../common/Navbar.ui";
import PageBanner from "../../common/page_banner";
import { connect } from "react-redux";
import { Button } from 'primereact/button';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import {sendingPromptSTK } from "../../redux/actions";
import { store } from "../../redux/configureStore";


class Payment extends Component {

    constructor(props){
        super(props);
        this.state = {
            phone: "",
            stk_prompt:false
        }
        this.client = new WebSocket(`ws://127.0.0.1:8000/ws/mpesa/payment/${this.props.user}/`)
    }


    handlePhoneNumber = event => {
        let phone = event.target.value;
        this.setState({
            phone
        })
    }

    handlePayment = event => {
        event.preventDefault();
        let data = {total: parseInt(Math.round(this.props.placed.total)), phone: this.state.phone}
        let json_data = JSON.stringify(data);
        this.client.send(json_data);
    }

    displayStatus = msg => {
        store.dispatch(sendingPromptSTK(msg));
        if(this.props.status.ResponseCode === "0"){
            this.setState({ stk_prompt: true })
        }
    }


    render(){
        let { pay } = this.props.match.params;
        let { order } = this.props;
        this.client.onopen = ()=> console.log("Websocket client connected")
        this.client.onclose = ()=> console.log("Websocket client closed")
        this.client.onmessage = (m) => {
            let msg = JSON.parse(m.data)
            console.log(m)
            console.log(typeof msg)
            this.displayStatus(msg)
        }
        return(
            <React.Fragment>
                <Navbar>
                    <PageBanner>
                        <h2>{pay}</h2>
                        <p>Payment | {pay}</p>
                    </PageBanner>
                    <section className="context-summary">
                        <div className="summary">
                            <p>This is to confirm that we've received your order!</p>
                            <div>
                                <h3>Hello {order.customer.first_name} {order.customer.last_name}</h3>
                                <p>Click the button below to authorize payment</p>
                            </div>
                            <form className="authorize-payment" onSubmit={this.handlePayment}>
                                <label>Please Enter your mpesa phone number:</label>
                                <PhoneInput
                                    country={'ke'}
                                    inputProps={{
                                        name: 'phone',
                                        required: true,
                                        autoFocus: true
                                    }}
                                    placeholder="+254 700 111 222"
                                    inputStyle={{ lineHeight: "40px", margin:"0 auto", width:"100%" }}
                                    containerStyle= {{ lineHeight: "40px", position: "relative", width:"40%", margin: "20px auto"  }}
                                    buttonStyle={{  display:"inline", position:"absolute", top:0, left:0, border:"none" }}
                                    onChange={(phone)=> this.setState({phone})}
                                    value={this.state.phone}
                                />
                                <div className="authorize-btn">
                                <Button className="mpesa-payment" label="Authorize Mpesa Payment" />
                                </div>
                            </form>
                            <div>
                                <p>Sending the mpesa prompt to your phone {this.state.stk_prompt ? <i className="pi pi-check" style={{'fontSize': '.8em'}}></i> : <i className="pi pi-spin pi-spinner" style={{'fontSize': '.8em'}}></i>}</p>
                                <p>Waiting for you to authorize by entering your mpesa pin <i className="pi pi-spin pi-spinner" style={{'fontSize': '.8em'}}></i> <i className="pi pi-check" style={{'fontSize': '.8em'}}></i></p>
                                <p>Successful transaction <i className="pi pi-spin pi-spinner" style={{'fontSize': '.8em'}}></i> <i className="pi pi-check" style={{'fontSize': '.8em'}}></i></p>
                            </div>
                        </div>
                    </section>
                </Navbar>
            </React.Fragment>
        )
    }
}


const mapStateToProps = (state, ownProps) => {
    return {
        order: state.orderDetail.order,
        placed: state.orderPlaced.placed,
        user: state.login.uid.id,
        status: state.promptSMS.status
    }
}

export default connect(mapStateToProps, null)(Payment);
