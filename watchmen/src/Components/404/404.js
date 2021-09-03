import React, { Component } from "react";
import NavbarUi from "../../common/Navbar.ui";
import { Button } from "primereact/button";
import GIF404 from "../../images/404_animation.gif"



class Error404 extends Component {

    handleBack = event => {
        this.props.history.goBack();
    }

    render(){
        return(
            <React.Fragment>
                <NavbarUi>

                    <section className="error-body">
                        <h5 className="error-code text-center">OOPS! Error 404</h5>
                        <img src={GIF404} alt="404gif" width="100%" height="600"/>
                        <p className="text-center">You are seeing this page because the resource you are looking for is not available</p>
                        <p className="text-center">Let us help you find your way back</p>

                        <div>
                            <Button label="Back" onClick={this.handleBack}/>
                        </div>
                    </section>
                </NavbarUi>
            </React.Fragment>
        )
    }

}


export default Error404;
