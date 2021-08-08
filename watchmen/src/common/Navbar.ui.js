import React, { Component } from "react";
import { Badge } from '../../node_modules/primereact/badge';
import { NavLink, Link } from "react-router-dom";
import { Tooltip } from 'primereact/tooltip';
import { connect } from "react-redux";
import { refreshCartItem } from "../redux/actions";
import { cartItemsDispatch } from "../redux/dispatchActions";
import Footer from "./Footer";
import { ScrollTop } from 'primereact/scrolltop';
import { Avatar } from 'primereact/avatar';
import { Sidebar } from 'primereact/sidebar';
import { OverlayPanel } from 'primereact/overlaypanel';
import cookie from "react-cookies";
import PropTypes from "prop-types";

class Navbar extends Component{

    constructor(props){
        super(props);
        this.state = {
            visible: false
        }
        this.overlay = React.createRef()
    }


    setVisible(){
        this.setState({
            visible: false
        })
    }

    showSearch = () => {
        this.setState({
            visible: true
        })
    }

    render(){
    let { tally } = this.props;
    let quantities= tally.length ? tally.map(item=> item.quantity) : 0
    let count = quantities ? quantities.reduce((a, b)=> a + b) : 0;
    const styleSetter = {
        color: "#78244C",
        textDecoration:"none"
    }


    return(
        <main>
        <ScrollTop />

        <Sidebar className="search-view" visible={this.state.visible} fullScreen onHide={() => this.setVisible()}>
            <form>
                <input type="search" name="products" placeholder="Search items here" />
                <button>Search</button>
            </form>
        </Sidebar>
        <div className="topbar-menu">
            <ul>
                <li>About Us</li>
                <li>Privacy</li>
                <li>FAQ</li>
                <li>Careers</li>
            </ul>

            <ul>
                <li>Wishlist</li>
                <li className="middleman">Track Your Order</li>
                <li>
                    <i className="pi pi-facebook"></i>
                    <i className="pi pi-twitter"></i>
                    <i className="pi pi-github"></i>
                    <i className="pi pi-youtube"></i>
                    <i className="pi pi-discord"></i>
                </li>
            </ul>
        </div>
        <nav className="top-menu">
            <div className="left-panel">
                <h2>Watchm<span className="mole">e</span>n</h2>

                <ul>
                    <li className="p-d-inline">
                        <NavLink activeStyle={styleSetter} to="/">Home</NavLink>
                    </li>
                    <li className="p-d-inline">
                        <NavLink activeStyle={styleSetter} to="/brands">Brands</NavLink>
                    </li>
                    <li className="p-d-inline">
                        <NavLink activeStyle={styleSetter} to="/category">Category</NavLink>
                    </li>
                    <li className="p-d-inline">
                        <NavLink activeStyle={styleSetter} to="/blog">Blog</NavLink>
                    </li>
                    <li className="p-d-inline">
                        <NavLink activeStyle={styleSetter} to="/products">Store</NavLink>
                    </li>
                </ul>
            </div>
            <ul>
                <li><i onClick={this.showSearch} className="pi pi-search search" style={{ 'fontSize': '1.2rem' }}></i></li>
                <li>
                    <Avatar label="P" shape="circle" size="large" aria-haspopup aria-controls="overlay_panel" onClick={(e) => this.overlay.current.toggle(e)}/>
                    <OverlayPanel ref={this.overlay} showCloseIcon id="overlay_panel"  style={{width: '150px'}} className="overlaypanel-demo">
                       {cookie.load("authToken") ? <>Log Out</> : <Link to="/login">Login</Link>}
                    </OverlayPanel>
                </li>
                <li><NavLink activeStyle={styleSetter} to="/cart">
                    <i className="pi pi-shopping-cart"></i>
                    <Badge className="badge-value" value={count ? count : "0"}></Badge>
                    </NavLink>
                </li>
            </ul>
        </nav>

        <div>
            {this.props.children}
        </div>
        <Footer />
        </main>
    )
    }
}

Navbar.propTypes = {
    tally: PropTypes.array,
    refreshCartItem: PropTypes.func
}

const mapStateToProps = (state, ownProps) => {
    return {
        tally: state.cartItems.cart,
    }
}

const mapDispatchToProps = {
    refreshCartItem,
    cartItemsDispatch
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
