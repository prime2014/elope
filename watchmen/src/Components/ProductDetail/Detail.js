import React, { Component } from "react";
import Navbar from "../../common/Navbar.ui";
import PageBanner from "../../common/page_banner";
import { dispatchProductDetail } from "../../redux/dispatchActions"
import { connect } from "react-redux";
import { Button } from 'primereact/button';
import { TabView,TabPanel } from 'primereact/tabview';
import { Rating } from 'primereact/rating';
import PropTypes from "prop-types";
import { Galleria } from 'primereact/galleria';
import { Avatar } from 'primereact/avatar';
import { deleteCartItem, dispatchCartItemDelete, dispatchUpdate, addItemToCart } from "../../redux/actions";
import CartAddSubtractBtn from "../../common/CartAddSubtractBtn";
import toast from "react-hot-toast";
import { cartAPI } from "../../services/cart/cart.service";
import FadeLoader from "react-spinners/FadeLoader";

class ProductDetail extends Component {
    constructor(props){
        super(props);
        this.state = {
            updated_items: []
        }
    }

    componentDidMount(){
        let pk = this.props.match.params.id;
        this.props.dispatchProductDetail(pk);
    }


    handleDisplayImage = (event)=>{
        let img = event.target.getAttribute("src");
        let sibling = event.target.parentElement.previousElementSibling;
        sibling.setAttribute("src", img)
    }

    itemTemplate(item) {
        return <img src={item} alt="product" style={{ width: '100%', display: 'block' }} />;
    }

    thumbnailTemplate(item) {
        return <img src={item} alt="product" style={{ width: "60px", display: 'block', height: "75px", margin:"5px 10px"}} />;
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
        console.log(item)
        this.props.dispatchCartItemDelete(item.id);
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

    handleDeleteItem = (item) => {
        if (this.props.login){
            let product =this.props.cart.find(prod=> prod.item === item.id);
            this.deleteCartFromBackend(product)
        } else {
            this.dispatchDeleteCart(item)
        }
    }

    render(){
        console.log(this.props);
        let { product, cart, login } = this.props;
        let data = product ? product : {};
        let cart_item = cart.length ? cart.find(item=> item.item === product.id) : null;
        console.log(cart_item)
        let responsiveOptions = [
            {
                breakpoint: '1024px',
                numVisible: 3
            },
            {
                breakpoint: '768px',
                numVisible: 2
            },
            {
                breakpoint: '560px',
                numVisible: 1
            }
        ];
        return(
            <>
            <Navbar cart={cart.length ? cart : []}>
                <PageBanner>
                    <h2>Product Detail</h2>
                    <p>Watches</p>
                </PageBanner>
                {Object.keys(data).length ?
                <>
                 <div className="py-4 detail-template">
                    <div className="row">
                        <div className="col-md-6">
                           <div className="product-image">
                                {/* <img className="detail-img" src={Object.keys(data).length ? product.image_urls[0] : ""} width="85%" alt="product" /> */}
                               <div className="py-2 image-gallery">
                                    {/* {data.image_urls.map(item=>{
                                        return(
                                          <img onClick={this.handleDisplayImage} className="gallery-img" src={item} alt="product" height="120px" width="120px"/>
                                        );
                                    })} */}
                                    <Galleria value={data.image_urls} responsiveOptions={responsiveOptions} numVisible={3} circular style={{ maxWidth: '200px', display:"flex", justifyContent:"center" }}
                                        showItemNavigators item={this.itemTemplate} thumbnail={this.thumbnailTemplate} />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <h5 className="py-2">{data.name}</h5>
                            <p>{product.currency} {data.price}</p>
                            <p>Availability: <span className="in-stock">In Stock</span></p>
                            <p>Rating: {data.rating}  <Rating value={data.rating} style={{ 'color':'goldenrod' }} stars={5} cancel={false}/></p>
                            <p className="pt-5">{data.short_description}</p>
                            <div className="pt-4 pd-quantity pb-5">
                                {cart_item ?
                                <>
                                <CartAddSubtractBtn rowData={cart_item} />
                                <i onClick={()=>this.handleDeleteItem(product)} className="pi pi-times-circle mx-4 clear" tooltip="Remove from Cart" title="Remove From Cart"></i>
                                </>
                                :
                                  <CartAddSubtractBtn rowData={cart_item} />
                                }
                            </div>
                        </div>
                    </div>

                     <div className="row pt-5">
                        <TabView>
                            <TabPanel header="Description">
                                {data.description}
                            </TabPanel>
                            <TabPanel header="Reviews">
                                <div>
                                    <div className="comment mb-4">
                                        <Avatar shape="circle" label="A" size="large"/>
                                        <div class="comment-thread">
                                            This is a very good watch. I love it.Cheers
                                        </div>
                                    </div>

                                    <div className="comment mb-4">
                                        <Avatar shape="circle" label="A" size="large"/>
                                        <div class="comment-thread">
                                            This is a very good watch. I love it.Cheers
                                        </div>
                                    </div>

                                    <div className="comment mb-4">
                                        <Avatar shape="circle" label="A" size="large"/>
                                        <div class="comment-thread">
                                            This is a very good watch. I love it.Cheers
                                        </div>
                                    </div>

                                    <div className="comment mb-4">
                                        <Avatar shape="circle" label="A" size="large"/>
                                        <div class="comment-thread">
                                            This is a very good watch. I love it.Cheers
                                        </div>
                                    </div>
                                </div>
                            </TabPanel>
                        </TabView >
                    </div>
                </div>
                </> :
                <div className="loadr">
                    <FadeLoader className="loaderr" color={"#ffd700"} loading={true} size={150} />
                </div>
                }
            </Navbar>
            </>
        )
    }
}


ProductDetail.propTypes = {
    cart: PropTypes.array,
    product: PropTypes.object
}


const mapStateToProps = (state) => {
    return {
        product: state.productDetail.product,
        cart: state.cartItems.cart,
        login: state.login.login
    }
}

const mapDispatchToProps = {
    dispatchProductDetail,
    dispatchUpdate,
    deleteCartItem,
    dispatchCartItemDelete,
    addItemToCart
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetail);
