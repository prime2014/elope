import React, { Component } from "react";
import Navbar from "../../common/Navbar.ui";
import PageBanner from "../../common/page_banner";



class PasswordReset extends Component {
    
    render(){
        return(
            <React.Fragment>
                <Navbar>
                    <PageBanner>
                        <h2>Reset Password</h2>
                        <p>Home | Password Reset</p>
                    </PageBanner>

                    <section>
                        <form>
                            
                        </form>
                    </section>
                </Navbar>
            </React.Fragment>
        )
    }
}

export default PasswordReset;