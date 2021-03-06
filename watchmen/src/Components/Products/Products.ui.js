import React, { Component } from "react";
import Navbar from "../../common/Navbar.ui";
import PageBanner from "../../common/page_banner";
import { connect } from "react-redux";
import { dispatchProductList } from "../../redux/dispatchActions";
import { Button } from 'primereact/button';
import { Link } from "react-router-dom";
import { cartAPI } from "../../services/cart/cart.service";
import {
    addItemToCart,
    updateCartItem,
    setProductList,
    setOrderDetail,
    setCartItems,
    updateQuantityAndTotal
} from "../../redux/actions";
import PropTypes from "prop-types";
import toast, { Toaster } from "react-hot-toast";
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { RadioButton } from 'primereact/radiobutton';
import { Slider } from 'primereact/slider';
import Fifty from "../../images/fifty-fathoms.png";
import { Paginator } from 'primereact/paginator';
import { store } from "../../redux/configureStore";
import { productAPI } from "../../services/products/product.service";
import ClipLoader from "react-spinners/ClipLoader";


class Products extends Component{
    constructor(props){
        super(props);
        this.state = {
            activeIndex:0,
            loading:false,
            progress: 0,
            view: false,
            product: {},
            value5: [20, 80]
        }
    }

    componentDidMount(){
        let { order, login } = this.props;
        if(login && Object.keys(order).length <= 0){
            productAPI.getProductsAndOrder().then(resp=>{
                console.log(resp);
                store.dispatch(setProductList(resp[0].data.results));
                store.dispatch(setOrderDetail(resp[1].data[0]));
                if(resp[1].data[0]) store.dispatch(setCartItems(resp[1].data[0].item_order));
            })
        } else {
            this.props.dispatchProductList();
        }
    }



    showQuickView = (event) => {
        event.currentTarget.firstChild.nextElementSibling.classList.add("show-eye");
        event.currentTarget.firstChild.classList.add("widen");
    }

    hideEye = (event) => {
        event.currentTarget.firstChild.nextElementSibling.classList.remove("show-eye");
        event.currentTarget.firstChild.classList.remove("widen");
    }

    resetLoaders = (spinner, button) =>{
        spinner.classList.remove("show-spinner");
        spinner.nextElementSibling.classList.remove("hideBtn");
        button.removeAttribute("disabled")
    }


    handleSubmitToBackendCart = (spinner, button, item) => {
        let exists = this.props.cart.find(prod=> prod.item === item.id);
            toast.promise(
                cartAPI.addToCart({'item': item.id}),
                {
                    loading: "Adding Item to cart...",
                    success:(data)=> {
                        if(data['id'] !== undefined && data['id'] !== null){
                            if (exists) this.props.updateCartItem(data);
                            else this.props.addItemToCart(data);
                            this.resetLoaders(spinner, button);
                            return "Item was successfully added to cart!"
                        } else {
                            this.resetLoaders(spinner, button);
                            return toast.error(Object.values(data.data)[0]);
                        }

                    },
                    error: (err)=>{
                        this.resetLoaders(spinner, button);
                        return "Item could not be added to cart!"
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
    }

    submitToCart = (spinner, button, watch)=>{
        let exists = this.props.cart.find(prod=> prod.item === watch.id);

        if (exists) {
            exists.quantity += 1;
            exists.net_total = exists.quantity * exists.price;
            this.props.updateQuantityAndTotal(exists);
            toast.success("Item was successfully added to cart",
                {
                    style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                    },
                }
            )
        } else {
            let product = {
                product_name: watch.name,
                item: watch.id,
                currency: watch.currency,
                quantity: 1,
                price: watch.price,
                net_total: watch.price,
                image_urls: watch.image_urls
            }
            this.props.addItemToCart(product);
            toast.success("Item was successfully added to cart",
                {
                    style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                    },
                }
            )
        }
        this.resetLoaders(spinner, button);
    }

    handleAddToCart = (event, item) => {
        let spinner = event.currentTarget.firstChild;
        let button = event.currentTarget;
        spinner.classList.add("show-spinner");
        spinner.nextElementSibling.classList.add("hideBtn");
        button.setAttribute("disabled", true);
        if (this.props.login){
            this.handleSubmitToBackendCart(spinner, button, item)
        } else {
            this.submitToCart(spinner, button, item)
        }
    }

    handleExpandTab = event => {
        event.target.nextElementSibling.className="display-list";
        console.log(event.target.nextElementSibling);
    }

    showItemDetail = product => {
        this.setState({
            view: true,
            product,
        })
    }

    hideDetail = event => {
        this.setState({
            view: false
        })
    }

    handleValueChange = (event, product)=>{

    }

    handleProductState = () => {
        let { product } = this.state;
        let selected = this.props.cart.find(prod=> prod.item === product.id)
        if (selected){
            return(
                <>
                <InputNumber name={selected.id} inputClassName="demon" min={1} id="quantity" showButtons buttonLayout="stacked"
                decrementButtonClassName="darrent" step={1} incrementButtonClassName="darrent" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus"
                value={selected.quantity} onValueChange={(event)=>this.handleValueChange(event, selected)} />

                <Button className="edit" icon="pi pi-pencil" iconPos="left" label="Update" />
                <Button className="delete" icon="pi pi-trash" iconPos="left" label="Delete" />
                </>
            )
        }
        return (
            <Button className="checkout" icon="pi pi-shopping-cart" iconPos="left" label="Add To Cart" />
        )
    }


    render(){
        let { products, cart, category} = this.props;
        console.log(cart);
        return(
            <React.Fragment>
            <Toaster />
            {Object.keys(this.state.product).length ?
                <Dialog header={this.state.product.name} visible={this.state.view} onHide={this.hideDetail} breakpoints={{'960px': '75vw', '640px': '120vw'}} style={{ width: "70vw", position: "fixed", top:40 }}>

                    <div className="set-view">
                        <img src={this.state.product.image_urls[0]} alt="watch"  width="200" height="200"/>
                        <div>
                            <h4>CATEGORY: {this.state.product.category}</h4>
                            <h5>Price: {this.state.product.currency} {this.state.product.price}</h5>
                            <div>
                                <h1>SHORT DESCRIPTION</h1>
                                <p>{this.state.product.short_description}</p>
                            </div>
                        </div>
                    </div>
                </Dialog>
            : null}

            <Navbar cart={ cart.length ? cart : [] }>
              <PageBanner>
                <h2>CATEGORY</h2>
                <p>Home | Category</p>
              </PageBanner>
                <section className="row product-template">
                    <div className="col-md-3">
                        <React.Fragment>
                        <div className="category">
                            <ul>
                                <li><span>
                                    Category
                                    <i className="pi pi-angle-down"></i>
                                    </span>
                                    <ul className="point">
                                        {category.length ? category.map(item=>{
                                            return(
                                                <li key={item.id}>{item.name}</li>
                                            )
                                        }) : ""}
                                    </ul>
                                </li>
                                <li><span>Price <i className="pi pi-angle-down"></i></span></li>
                                <li><span>Brand <i className="pi pi-angle-down"></i></span></li>
                            </ul>
                            <div className="filter-class">
                                <h6>Filter By Color</h6>
                                <ul>
                                    <li><RadioButton value="All" name="city" checked={true} /> All</li>
                                    <li><RadioButton value="Red" name="city" checked={false} /> Red</li>
                                    <li><RadioButton value="Black" name="city" checked={false} /> Black</li>
                                    <li><RadioButton value="Silver" name="city" checked={false} /> Silver</li>
                                    <li><RadioButton value="Grey" name="city" checked={false} /> Grey</li>
                                </ul>
                            </div>
                            <div className="price-class">
                                <h6>Filter By Price</h6>
                                <div className="price-range"><Slider value={this.state.value5} min={0} max={4000} onChange={(e) => this.setState({ value5: e.value })} range /></div>
                                <p>KES {this.state.value5[0]} to KES {this.state.value5[1]}</p>
                            </div>

                        </div>
                        <div className="advert">
                            <img src={Fifty} alt="advert" width="100%"/>
                        </div>
                        </React.Fragment>
                    </div>

                    <div className="col-md-9">
                        <div className="row first-decima">
                            {products.length ? products.map(item=>{
                            return(
                                <div className="col-md-4 product-card">
                                    <div onMouseEnter={(event)=>this.showQuickView(event)} onMouseLeave={(event)=>this.hideEye(event)} className="productss">
                                        <Link to={`/detail/${item.slug}/${item.id}`}><img className="p-img" src={item.image_urls[0]} alt="products" height="350px"/></Link>
                                        <Button onClick={()=>this.showItemDetail(item)} className="cart-btn quick-view" icon="pi pi-eye" tooltip="Quick View"/>
                                        <div className="btns">
                                            <button disabled={false} onClick={(event)=>this.handleAddToCart(event, item)} className="cart-btn">
                                                <div className="spinner-border text-white spinner mx-1" role="status">
                                                   {/*  <span className="sr-only">Loading...</span> */}
                                                </div>
                                                <i className="pi pi-shopping-cart"></i>
                                            </button>

                                            <Button className="cart-btn wishlist" icon="pi pi-heart" tooltip="Wish List" />
                                        </div>
                                    </div>
                                    <p>{item.name}</p>
                                    <p>{item.currency} {item.price}</p>
                                </div>
                            );
                            }):
                            <div className="diffident">
                                <ClipLoader color={"#ffd700"} loading={true} size={80} />
                            </div>
                            }
                        </div>
                        <Paginator first={1} rows={10} totalRecords={120}></Paginator>
                    </div>
                </section>
            </Navbar>
            </React.Fragment>
        )
    }
}

Products.propTypes = {
    products: PropTypes.array,
    cart: PropTypes.array,
}

const mapStateToProps = (state) => {
    return {
        products: state.products.products,
        category: state.category.category,
        login: state.login.login,
        cart: state.cartItems.cart,
        progress: state.progress.progress,
        order: state.orderDetail.order
    }
}

const mapDispatchToProps = {
    dispatchProductList,
    addItemToCart,
    updateCartItem,
    updateQuantityAndTotal
}

export default connect(mapStateToProps, mapDispatchToProps)(Products);
