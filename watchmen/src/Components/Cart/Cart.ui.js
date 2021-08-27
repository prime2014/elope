import React, { Component } from "react";
import Navbar from "../../common/Navbar.ui";
import PageBanner from "../../common/page_banner";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { connect } from "react-redux";
import { cartItemsDispatch, dispatchUpdateCartItem } from "../../redux/dispatchActions";
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import PropTypes from "prop-types";
import toast, { Toaster } from "react-hot-toast";
import { cartAPI } from "../../services/cart/cart.service";
import { deleteCartItem, dispatchCartItemDelete, dispatchUpdate } from "../../redux/actions";
import CartAddSubtractBtn from "../../common/CartAddSubtractBtn";


class Cart extends Component{

    constructor(props){
        super(props);
        this.state = {
            loading:false,
            updated_items: []
        }
    }

    componentDidMount(){
        let { cart } = this.props;
        if (cart.length) return;
        else {
            this.props.cartItemsDispatch();
        }
    }

    // { id, currency, price, net_total }

    nameTemplate = rowData => {
       return rowData.product_name;
    }

    imageBodyTemplate = rowData => {
        return <img src={rowData.image_urls[0]} alt="cart_product" width="70" height="70"/>
    }

    priceBodyTemplate = rowData => {
        return rowData.currency + " " + rowData.price;
    }

    netTotalTemplate = rowData => {
        return rowData.currency + " " + rowData.net_total;
    }

    handleValueChange = (event, item) => {
        console.log(item);
        event.target['product'] = item.item;

        let exists = this.state.updated_items.find(item=> item.name === event.target.name)
        if(exists){
            let products = this.state.updated_items;
            let index = products.findIndex(item=> item.name === exists.name);
            products.splice(index, 1, event.target);
            this.setState({
                updated_items: products
            })
        } else {
            this.setState({
                updated_items: [...this.state.updated_items, event.target]
            })
        }
    }

    handleUpdateValue = (event, rowData)=>{
        let value = event.target.value;
        rowData.quantity = value;
        rowData.net_total = rowData.quantity * rowData.price;
        this.props.dispatchUpdate(rowData)
    }

    quantityTemplate = rowData => {
        return (
            <CartAddSubtractBtn rowData={rowData} changeValueAPI={this.handleValueChange} changeValue={this.handleUpdateValue}/>
        )
    }



    deleteCartFromBackend = (item) => {
        toast.promise(
            cartAPI.deleteCartItem(item.id),
                {
                    loading: "Deleting cart item...",
                    success: (data)=>{
                       this.props.deleteCartItem(item.id);
                       return "Item was successfully deleted"
                    },
                    error:(err)=>{
                        console.log(err);
                        return "Could not delete cart item"
                    }
                },
                {
                    style: {
                       borderRadius: '20px',
                       background: '#333',
                       color: '#fff',
                    },
                }
            )
    }

    dispatchDeleteCart = item => {
        console.log(item);
        this.props.dispatchCartItemDelete(item.item);
        toast.success("The item was successfully deleted",
            {
                style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
                },
            }
        )
    }

    deleteCartItem = item => {
        if (this.props.login){
            this.deleteCartFromBackend(item)
        } else {
            this.dispatchDeleteCart(item)
        }
    }

    deleteItem = rowData => {
        return <i onClick={()=>this.deleteCartItem(rowData)} className="pi pi-trash"></i>;
    }

    handleUpdate = () => {
        this.setState({
            loading:true
        }, ()=>{
            this.state.updated_items.forEach((item,index)=>{
                let data = {product:item.product, quantity:item.value}
                this.props.dispatchUpdateCartItem(item.name, data);
            });
            this.setState({
                loading:false
            })
        })
    }

    handleGoToStore = () => {
        this.props.history.push("/products");
    }

    checkout = () => {
        this.props.history.push("/checkout");
    }

    render(){
        let { cart } = this.props;
        let data = cart.map(item=> item.net_total);
        const header = (
            <div className="table-header">
                Cart
            </div>
        );
        return(
            <>
            <div><Toaster /></div>
            <Navbar cart={ cart.length ? cart : [] }>
                <PageBanner>
                    <h2>CART</h2>
                    <p>Home | Cart</p>
                </PageBanner>
                <div className="cart-template datatable-responsive-demo">
                    <div>
                        <DataTable className="p-datatable-responsive-demo" stripedRows scrollable scrollHeight="320px" resizableColumns columnResizeMode="fit" value={cart} header={header}>
                            <Column field="name" header="Name" body={this.nameTemplate}></Column>
                            <Column header="Image" body={this.imageBodyTemplate}></Column>
                            <Column header="Quantity" body={ this.quantityTemplate }></Column>
                            <Column field="price" header="Price" body={this.priceBodyTemplate}></Column>
                            <Column field="delete" header="Delete" body={this.deleteItem}></Column>
                        </DataTable>
                    </div>
                    <div className="cart-action-btns py-3">
                        <div className="btn-wrapper">
                            <Button onClick={this.handleUpdate} loading={this.state.loading} className="update-cart-btn" loadingOptions={{ 'position': 'right' }} label={this.state.loading ? "Updating...": "Update Cart"}/>
                            <Button label="Close Coupon" className="coupon"/>
                        </div>
                    </div>
                    <div className="py-3 subtotal px-5">
                        <div className="tally">
                            <span>Subtotal</span>
                            <span>KES {data.length ? parseFloat(data.reduce((p, c)=> parseFloat(p) + parseFloat(c))).toFixed(2): 0}</span>
                        </div>
                    </div>
                    <div className="py-3">
                        <Button onClick={this.handleGoToStore} className="shop mx-2" label="Continue Shopping" />
                        <Button className="checkout" onClick={this.checkout} label="Proceed To Checkout" />
                    </div>
                </div>
            </Navbar>
            </>
        )
    }
}

Cart.propTypes = {
    cart: PropTypes.array
}

const mapStateToProps = (state, ownProps) => {
    return {
        cart: state.cartItems.cart,
        login: state.login.login
    }
}

const mapDispatchToProps = {
    cartItemsDispatch,
    dispatchUpdateCartItem,
    deleteCartItem,
    dispatchCartItemDelete,
    dispatchUpdate
}

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
