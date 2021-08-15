import React, { Component } from "react";
import Navbar from "../../common/Navbar.ui";
import PageBanner from "../../common/page_banner";

class Payment extends Component {

    render(){
        let { pay } = this.props.match.params
        return(
            <React.Fragment>
                <Navbar>
                    <PageBanner>
                        <h2>{pay}</h2>
                        <p>Payment | {pay}</p>
                    </PageBanner>
                    <section>

                    </section>
                </Navbar>
            </React.Fragment>
        )
    }
}

export default Payment;
