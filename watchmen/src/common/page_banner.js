import React from "react";


const PageBanner = props => {

    return(
        <div className="cat">
            <div className="inner-cat">
               {props.children}
            </div>
        </div>
    )
}

export default PageBanner;
