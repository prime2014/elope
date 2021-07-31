import React from "react";




const Footer = props => {
    return(
        <footer>
            <section>
            <div className="footer-top row">
                <div className="col-md-4 col-12">
                    <h5>Subscribe Newsletter</h5>
                    <span>Subscribe newsletter to get 5% on all products</span>
                </div>
                <form className="col-md-6 col-12">
                    <input type="text" name="email" placeholder="Enter your email" />
                    <button>Subscribe</button>
                </form>
                <div className="col-md-2 col-12 icons-footer">
                    <i className="pi pi-facebook"></i>
                    <i className="pi pi-youtube"></i>
                    <i className="pi pi-twitter"></i>
                </div>
            </div>
            <div className="footer-middle row pt-5">
                <h2 className="col-md-4">Watchm<span className="mole">e</span>n</h2>

                <div className="col-md-2">
                    <h4>Shop Men</h4>
                    <ul>
                        <li>Archaic</li>
                        <li>Brand</li>
                        <li>Custom</li>
                        <li>Pocket</li>
                    </ul>
                </div>

                <div className="col-md-2">
                    <h4>Shop Women</h4>
                    <ul>
                        <li>Archaic</li>
                        <li>Brand</li>
                        <li>Custom</li>
                        <li>Pocket</li>
                    </ul>
                </div>

                <div className="col-md-2">
                    <h4>House</h4>
                    <ul>
                        <li>Archaic</li>
                        <li>Brand</li>
                        <li>Custom</li>
                    </ul>
                </div>

                <div className="col-md-2">
                    <h4>Quick Links</h4>
                    <ul>
                        <li>Track Your Order</li>
                        <li>Support</li>
                        <li>FAQ</li>
                        <li>Carrier</li>
                        <li>About</li>
                        <li>Contact Us</li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                <p>Copyright ©2021 All rights reserved | This template is made with <i className="pi pi-heart"></i>  by Prime</p>
            </div>
            </section>
        </footer>
    )
}


export default Footer;
