import React, { Component } from "react";
import Navbar from "../../common/Navbar.ui";
import PageBanner from "../../common/page_banner";
import { connect } from "react-redux";
import { dispatchProductList } from "../../redux/dispatchActions";
import { Button } from 'primereact/button';
import { Link } from "react-router-dom";
import { cartAPI } from "../../services/cart/cart.service";
import { addItemToCart, updateCartItem } from "../../redux/actions";
import PropTypes from "prop-types";
import toast, { Toaster } from "react-hot-toast";


class Products extends Component{
    constructor(props){
        super(props);
        this.state = {
            activeIndex:0,
            loading:false,
            progress: 0
        }
    }

    componentDidMount(){
        let { category, products } = this.props;
        if(category.length && products.length) return;
        else {
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

    handleAddToCart = (event, item) => {
        let spinner = event.currentTarget.firstChild;
        let button = event.currentTarget;
        spinner.classList.add("show-spinner");
        spinner.nextElementSibling.classList.add("hideBtn");
        button.setAttribute("disabled", true);
        let exists = this.props.cart.find(prod=> prod.item === item.id);
        toast.promise(
            cartAPI.addToCart({'item': item.id}),
            {
                loading: "Adding Item to cart...",
                success:(data)=> {
                    if (exists) this.props.updateCartItem(data);
                    else this.props.addItemToCart(data);
                    spinner.classList.remove("show-spinner");
                    spinner.nextElementSibling.classList.remove("hideBtn");
                    button.removeAttribute("disabled")
                    return "Item was successfully added to cart!"
                },
                error: (err)=>{
                    spinner.classList.remove("show-spinner");
                    spinner.nextElementSibling.classList.remove("hideBtn");
                    button.removeAttribute("disabled");
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

    handleExpandTab = event => {
        event.target.nextElementSibling.className="display-list";
        console.log(event.target.nextElementSibling);
    }


    render(){
        let { products, cart, progress, category } = this.props;
        console.log(progress);
        return(
            <React.Fragment>
            <Toaster />
            <div className={progress !== 100 ? "loadd" : "progress-bar"}>
                <div className="progress"></div>
            </div>
            <Navbar cart={ cart.length ? cart : [] }>
              <PageBanner>
                <h2>CATEGORY</h2>
                <p>Home | Category</p>
              </PageBanner>
                <section className="row product-template">
                    <div className="col-md-3">
                        <div className="category">
                            <ul>
                                <li><span onClick={this.handleExpandTab}>
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
                                <li><span onClick={this.handleExpandTab}>Price <i className="pi pi-angle-down"></i></span></li>
                                <li><span onClick={this.handleExpandTab}>Brand <i className="pi pi-angle-down"></i></span></li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-md-9">
                        <div className="row">
                            {products.map(item=>{
                            return(
                                <div className="col-md-4 product-card">
                                    <div onMouseEnter={(event)=>this.showQuickView(event)} onMouseLeave={(event)=>this.hideEye(event)} className="productss">
                                        <Link to={`/detail/${item.slug}/${item.id}`}><img className="p-img" src={item.image_urls[0]} alt="products" height="350px"/></Link>
                                        <Button className="cart-btn quick-view" icon="pi pi-eye" tooltip="Quick View"/>
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
                            })}
                        </div>
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
        progress: state.progress.progress
    }
}

const mapDispatchToProps = {
    dispatchProductList,
    addItemToCart,
    updateCartItem
}

export default connect(mapStateToProps, mapDispatchToProps)(Products);
