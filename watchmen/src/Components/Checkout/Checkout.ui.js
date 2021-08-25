import React, { Component } from "react";
import Navbar from "../../common/Navbar.ui";
import PageBanner from "../../common/page_banner";
import { Link } from "react-router-dom";
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import  { connect } from "react-redux";
import { dispatchSetOrderDetail } from "../../redux/dispatchActions";
import { SplitButton } from 'primereact/splitbutton';
import toast, { Toaster } from "react-hot-toast";
import { orderAPI } from "../../services/order/order.service";
import { Message } from 'primereact/message';
import { addOrderShipping, setPaymentMeans } from "../../redux/actions";
import { store } from "../../redux/configureStore";
import { confirmDialog } from 'primereact/confirmdialog';
import { setPlacedOrder } from "../../redux/actions";


class Checkout extends Component{

    constructor(props){
        super(props);
        this.state = {
            paypal: false,
            loading:false,
            checked: false,
            first_name: "",
            last_name: "",
            company: "",
            email: "",
            phone: "",
            country: "Kenya",
            town: "",
            address_line_1: "",
            address_line_2: "",
            district: "district1",
            postal_code: "",
            payment_means: "unknown"

        };
        this.baseState = this.state;
    }

    handlePaypal = () => {
        this.setState({
            paypal:!this.state.paypal
        })
    }

    handleCheckBox = () => {

        this.setState({
            checked: !this.state.checked
        })
    }

    handleShopper = () =>{
        this.props.history.push("/products")
    }

    handleBackToCart = () => {
        this.props.history.goBack();
    }

    componentDidMount(){
        let { order_id, login } = this.props;

        if(login && order_id) this.props.dispatchSetOrderDetail(order_id);
    }

    handleSubmitShipping = event => {
        event.preventDefault();
        let {paypal, loading, checked, ...rest} = this.state;
        this.setState({
            loading: true
        },()=>{
            let order_id = this.props.cart[0].order_detail;
            toast.promise(orderAPI.addShippingAddress(order_id, rest),
                {
                    loading: "Saving Shipping Address...",
                    success:(data)=>{
                        this.setState(
                            this.baseState,
                            ()=> this.props.addOrderShipping(data)
                        );
                        return "Shipping Address was successfully saved."
                    },
                    error:(error)=>{
                        this.setState(this.baseState);
                        return "Could not save shipping address. Try again!";
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

    handleFirstName = event => {
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

    handleCountry = event => {
        this.setState({
            country: event.target.value
        })
    }

    handlePhone = event => {
        this.setState({
            phone: event.target.value
        })
    }

    handleAddressOne = event => {
        this.setState({
            address_line_1: event.target.value
        })
    }

    handleAddressTwo = event => {
        this.setState({
            address_line_2: event.target.value
        })
    }

    handleTown = event => {
        this.setState({
            town: event.target.value
        })
    }

    handleDistrict = event => {
        this.setState({
            district: event.target.value
        })
    }

    handlePostalCode = event => {
        this.setState({
            postal_code: event.target.value
        })
    }

   handleCompany = event => {
        this.setState({
            company: event.target.value
        })
   }

   setActive = event => {
       this.setState({
           active: !this.state.active
       })
   }

   handlePlaceOrder = event => {
        let { order, payment } = this.props;

        let items = Object.keys(order).length ? order.item_order : [];
        let prices = items ? items.map(a => parseFloat(a.net_total)) : [];
        let sub_total = prices.length ? parseFloat(prices.reduce((a, b)=> a + b)).toFixed(2) : 0;
        if(!this.props.payment){
            confirmDialog({
                message: 'Click dropdown arrow on checkout button to select payment.',
                header: 'Payment Unknown',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: "OK",
                rejectLabel: "Exit"
            });
        } else {
            let that = this
            let data = {sub_total, total: sub_total }
            let place_order = orderAPI.placeOrder(order.id, data)
            toast.promise(place_order, {
                loading: "Please wait while we place your order...",
                success: (data) =>{
                    console.log(data);
                    store.dispatch(setPlacedOrder(data));
                    that.props.history.push(`/payment/gateway/${payment}`);
                    return "Your order was succesffully placed";
                },
                error: err => Object.keys(err)[0]
                },
                {
                    style: {
                     borderRadius: '10px',
                     background: '#333',
                     color: '#fff',
                    },
                }
            )
        }
    }

    authUserTotal = (sub_total) => this.props.order.shipping_price ? parseFloat(sub_total + this.props.order.shipping_price).toFixed(2) : sub_total;
    notauthUserTotal = (data) => data.length ? parseFloat(data.reduce((p, c)=> parseFloat(p) + parseFloat(c))).toFixed(2): 0;


    render(){
        let { cart, order, login } = this.props;
        let data = cart.map(item=> item.net_total);
        let items = Object.keys(order).length ? order.item_order : cart;
        let prices = items ? items.map(a => parseFloat(a.net_total)) : [];
        let sub_total = prices.length ? parseFloat(prices.reduce((a, b)=> a + b)).toFixed(2) : 0;
        const utils = [
            {
                label: 'Pay through Mpesa',
                icon: 'pi pi-mobile',
                command: (e) => {
                    store.dispatch(setPaymentMeans("MPESA"))
                }
            },
            {
                label: 'Paypal',
                icon: 'pi pi-paypal',
                command: (e) => {
                    store.dispatch(setPaymentMeans("PAYPAL"))
                }
            },
            {
                label: 'Pay through bank',
                icon: 'pi pi-credit-card',
                command: (e) => {
                    store.dispatch(setPaymentMeans("BANK"))
                }
            },
            {
                label: 'Cash on delivery',
                icon: 'pi pi-money-bill',
                command: (e) => {

                }
            }
        ]
        return(
            <>
            <Toaster />
            <Navbar cart={ cart }>
                <PageBanner>
                    <h2>CHECKOUT</h2>
                    <p>Home | Checkout</p>
                </PageBanner>
                <div className="checkout-template">
                    <div className="check-btns">
                        <Button onClick={this.handleShopper} label="Continue Shopping" className="still-shop"/>
                        <Button onClick={this.handleBackToCart} icon="pi pi-arrow-left" iconPos="left" label="Back To Cart" className="to-cart" />
                    </div>
                    <p className="log-in py-2 px-1">Returning Customer? <Link to="/login">Click here to login</Link></p>

                    <div>
                        <p className="tale">If you have shopped with us before, please enter your details in the boxes below. If you are a new customer, please proceed to the Billing & Shipping section.</p>
                    </div>
                    <div className="py-2">
                        <input className="credentials" type="text" name="email" placeholder="username or email*" />
                        <input className="credentials" type="password" name="passsword" placeholder="password*" />
                    </div>
                    <div>
                        <Button className="sign-in" loading={false} loadingOptions={{'position': 'right'}} label="Log In" />
                    </div>
                    <p><Link to="/password-reset" className="reset">Lost your password?</Link></p>
                    <div className="row py-3">
                        <div className="col-md-8 col-12">
                            <h5>Shipping Details</h5>
                            <form onSubmit={this.handleSubmitShipping} className="billing-form" autoComplete="off">
                                <div className="row">
                                    <div className="col-md-6 pb-4">
                                        <input onChange={this.handleFirstName} type="text" name="first_name" placeholder="First Name" value={this.state.first_name} required/>
                                    </div>
                                    <div className="col-md-6 pb-4">
                                        <input onChange={this.handleLastName} type="text" name="last_name" placeholder="Last Name" value={this.state.last_name} />
                                    </div>
                                    <div className="col-md-12 pb-4">
                                        <input onChange={this.handleCompany} type="text" name="company" placeholder="Company" value={this.state.company}/>
                                    </div>
                                    <div className="col-md-6 pb-4">
                                        <input onChange={this.handlePhone} type="text" name="phone_number" placeholder="Phone Number" value={this.state.phone} required/>
                                    </div>
                                    <div className="col-md-6 pb-4">
                                        <input onChange={this.handleEmail} type="email" name="email" placeholder="Email Address" value={this.state.email} required/>
                                    </div>
                                    <div className="col-md-12 pb-4">
                                        <select onChange={this.handleCountry} value={this.state.country} required>
                                            <option value="Kenya">Kenya</option>
                                            <option value="Uganda">Uganda</option>
                                            <option value="Tanzania">Tanzania</option>
                                            <option value="Somalia">Somalia</option>
                                            <option value="Ethiopia">Ethiopia</option>
                                        </select>
                                    </div>
                                    <div className="col-md-12 pb-4">
                                        <input onChange={this.handleAddressOne} type="address" name="address" placeholder="Address Line 1" value={this.state.address_line_1} required/>
                                    </div>
                                    <div className="col-md-12 pb-4">
                                        <input onChange={this.handleAddressTwo} type="address" name="address2" placeholder="Address Line 2" value={this.state.address_line_2}/>
                                    </div>
                                    <div className="col-md-12 pb-4">
                                        <input onChange={this.handleTown} type="text" name="town" placeholder="Town/City" value={this.state.town} required/>
                                    </div>
                                    <div className="col-md-12 pb-4">
                                        <select onChange={this.handleDistrict} value={this.state.district}>
                                            <option value="district1">district1</option>
                                            <option value="district2">district2</option>
                                            <option value="district3">district3</option>
                                            <option value="district4">district4</option>
                                            <option value="district5">district5</option>
                                        </select>
                                    </div>
                                    <div className="col-md-12 pb-4">
                                        <input onChange={this.handlePostalCode} type="text" name="zip" placeholder="Postcode/ZIP" value={this.state.postal_code} required/>
                                    </div>
                                </div>
                                <div>
                                    <Button loading={this.state.loading} className="shipping-address" label={this.state.loading ? "Saving..." : "Save Shipping Address"} loadingOptions={{ 'position': 'right' }}/>
                                </div>
                            </form>
                        </div>
                        <div className="col-md-4 col-12">
                           <div className="order-template px-3">
                                <h6>Your Order</h6>
                                <hr/>
                                <div>
                                    <div className="order-header">
                                        <span>Product</span>
                                        <span>Total</span>
                                    </div>
                                    {cart.length ? cart.map(item=>{
                                        return(
                                            <div className="order-header py-2">
                                                <span className="product_name">{item.product_name}</span>
                                                <span>x{item.quantity}</span>
                                                <span>{item.currency} {item.net_total}</span>
                                            </div>
                                        )
                                    }) : <p className="text-center py-2">There are no items yet in cart</p>}


                                    <div className="order-header thread py-2">
                                        <span>SUBTOTAL</span>
                                        <span>{order.currency || "KES"} {login ? sub_total : this.notauthUserTotal(data)}</span>
                                    </div>
                                    <div className="order-header thread py-2">
                                        <span>SHIPPING</span>
                                        <span>{order.currency || "KES"} {order.shipping_price ? order.shipping_price : 0}</span>
                                    </div>
                                    <div className="order-header thread py-2">
                                        <span>TOTAL</span>
                                        <span>{order.currency || "KES"} {login ? this.authUserTotal(sub_total) : this.notauthUserTotal(data)}</span>
                                    </div>
                                    <div className="py-3">
                                        <input type="radio" name="paypal" onChange={this.handlePaypal} checked={this.state.paypal} value="paypal" /> Paypal
                                    </div>
                                    <div className="conditions pb-3">
                                        <Checkbox onChange={this.handleCheckBox} checked={this.state.checked}></Checkbox> I have read and accept the terms & conditions
                                    </div>

                                    <div className="notify"><Message severity="warn" text="To complete Checkout you must enter shipping address"></Message></div>

                                    <SplitButton onClick={this.handlePlaceOrder} disabled={ cart.length ? false : true} label={`Checkout ${order.currency ? order.currency : "KES"} ${login ? this.authUserTotal(sub_total) : this.notauthUserTotal(data)}`} className="paypal-btn" icon="pi pi-plus"  model={utils}></SplitButton>
                                </div>
                           </div>
                        </div>
                    </div>
                </div>
            </Navbar>
            </>
        );
    }
}

const mapStateToProps = (state, ownProps)=>{
    return {
        cart: state.cartItems.cart,
        order: state.orderDetail.order,
        payment: state.orderDetail.payment,
        order_id:state.cartItems.order_id,
        user: state.login.uid.id,
        login: state.login.login,
        placed: state.orderPlaced.placed
    }
}

const mapDispatchToProps = {
    dispatchSetOrderDetail,
    addOrderShipping
}

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);
