import React from "react";
import { Card } from 'primereact/card';
import Profile1 from "../images/profile1.jpg";
import Profile2 from "../images/profile2.png";
import Profile3 from "../images/profile3.jpg";



const Testimonials = props => {

    return(
        <React.Fragment>
            <div className="row confess">
                <div className="col-md-4 px-2 text-center">
                    <Card className="testimony-card">
                        <img src={Profile1} alt="profile" width="100" height="100" />
                        <blockquote>
                        “Lorem ipsum dolor sit amet, sed tempor incididunt ut labore et dolore magna alique.”
                        </blockquote>
                        <hr />
                        <div>
                            <h6>Dave Williams</h6>
                            <p>Customer</p>
                        </div>
                    </Card>
                </div>

                <div className="col-md-4 px-2 text-center">
                    <Card className="testimony-card">
                        <img src={Profile2} alt="profile" width="100" height="100" />
                        <blockquote>
                        “Lorem ipsum dolor sit amet, sed tempor incididunt ut labore et dolore magna alique.”
                        </blockquote>
                        <hr />
                        <div>
                            <h6>Dave Williams</h6>
                            <p>Customer</p>
                        </div>
                    </Card>
                </div>

                <div className="col-md-4 px-2 text-center">
                    <Card className="testimony-card">
                        <img src={Profile3} alt="profile" width="100" height="100" />
                        <blockquote>
                        “Lorem ipsum dolor sit amet, sed tempor incididunt ut labore et dolore magna alique.”
                        </blockquote>
                        <hr />
                        <div>
                            <h6>Dave Williams</h6>
                            <p>Customer</p>
                        </div>
                    </Card>
                </div>

            </div>
        </React.Fragment>
    )
}


export default Testimonials;
