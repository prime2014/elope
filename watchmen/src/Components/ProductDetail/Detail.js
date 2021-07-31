import React, { Component } from "react";
import Navbar from "../../common/Navbar.ui";
import PageBanner from "../../common/page_banner";
import { dispatchProductDetail } from "../../redux/dispatchActions"
import { connect } from "react-redux";
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { TabView,TabPanel } from 'primereact/tabview';
import { Rating } from 'primereact/rating';
import PropTypes from "prop-types";
import { Galleria } from 'primereact/galleria';
import { Avatar } from 'primereact/avatar';


class ProductDetail extends Component {

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
        return <img src={item} alt="product" style={{ display: 'block', height: "75px", margin:"5px 20px"}} />;
    }

    render(){
        let { product, cart } = this.props;
        let data = product ? product : {};
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
                                    <Galleria value={data.image_urls} responsiveOptions={responsiveOptions} numVisible={3} circular style={{ maxWidth: '500px', display:"flex", justifyContent:"center" }}
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
                                <InputNumber inputClassName="demon" min={1} id="quantity" showButtons buttonLayout="stacked"
                                decrementButtonClassName="darrent" step={1} incrementButtonClassName="darrent" incrementButtonIcon="pi pi-angle-up" decrementButtonIcon="pi pi-angle-down"
                                value={1} prefix="Qty  " />

                                <Button className="pd-cart" label="Add To Cart" icon="pi pi-shopping-cart" iconPos="left" />
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
                </> : " "}
            </Navbar>
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
        cart: state.cartItems.cart
    }
}

const mapDispatchToProps = {
    dispatchProductDetail
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetail);
