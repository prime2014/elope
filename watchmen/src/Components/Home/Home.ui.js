import React, { Component } from "react";
import Navbar from "../../common/Navbar.ui";
import FadeCarousel from 'fade-carousel'
import Banner1 from "../../images/watch1.jpg"
import Banner2 from "../../images/ant2.jpg";
import { dispatchTrends, dispatchCategory } from "../../redux/dispatchActions";
import { connect } from "react-redux";
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import { Link } from "react-router-dom";
import Websocket from "react-websocket";
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { motion } from "framer-motion";

class Home extends Component {
      constructor(props){
           super(props);
           this.imageRef = React.createRef();
      }

      componentDidMount(){
        this.props.dispatchTrends();
        this.props.dispatchCategory();
      }

      changeImage = (event, image_urls) => {
        event.currentTarget.firstElementChild.setAttribute("src", image_urls[2]);
        event.currentTarget.lastChild.classList.add("move");
      }

      resetImage = (event, image_urls) => {
        event.currentTarget.firstElementChild.setAttribute("src", image_urls[0]);
        event.currentTarget.lastChild.classList.remove("move");
      }

      showShopTag = (event) => {
        event.currentTarget.lastChild.classList.add("pull-up");
      }

      resetShopTag = (event) => {
        event.currentTarget.lastChild.classList.remove("pull-up");
      }

      handleOpenConnection = (event)=> console.log("websocket client connected...");
      handleCloseConnection = (event)=> console.log("websocket client closed");
      handleGetMessage = (msg)=>{
        let data = JSON.parse(msg);
        console.log("message=", data['message'])
      }

      render(){
        const urls= [Banner1, Banner2];


         const divStyle = {
            height: "600px",
            width: "100%",
            backgroundColor: '#f2f2f2'
          }
          const imageStyle = {
            height: '100%',
            width: 'auto',
            justifySelf: 'center',
            position:"relative"
          }
          const hello = () => {
            console.log("hello");
          };
          let { trends, category, cart } = this.props;

          const itr = {
             visible: {opacity: 1,
              transition:{
                when: "beforeChildren",
                staggerChildren: 0.3,
              }
            },
             hidden:{opacity: 0,
              transition: {
                when: "afterChildren",
              }
            }
          }

          const item = {
            visible: ()=> ({
              opacity: 1,
              y: 100,
              transition: {
                delay: 0.3,
              },
            }),
            hidden: { opacity: 0, y: -100,
              transition: {
                delay:0.3
              }
            },
          }

        return(
            <Navbar cart={ cart }>
                <Websocket
                  url="ws://127.0.0.1:8000/ws/help/service/"
                  onOpen={this.handleOpenConnection}
                  onMessage={this.handleGetMessage}
                  onClose={this.handleCloseConnection}
                />
                <div className="App">
                  <FadeCarousel divStyle={divStyle} delay={4000} mode={"fade"} >
                    {urls.map((url, index) => {
                        return(
                          <div className="banner-images" key={index} style={imageStyle}>
                          {index === 0 ?
                            <div className="first">
                              <h4>Watch Sale</h4>
                              <motion.h1>Sophisticated & Elegant</motion.h1>
                              <motion.p>Consectetur adipiscing elit. Morbi venenatis lorem quis eros placerat, sit amet
                                pretium ante hendrerit. Fusce euismod tempus tortor, nec gravida tellus venenatis ac.
                                In euismod mollis ultricies.
                              </motion.p>
                              <motion.button>Shop now</motion.button>
                            </div> :
                              <div className="second">
                                <h4>Watch Sale</h4>
                                <motion.h1>Up To One Year Warranty</motion.h1>
                                <motion.div>
                                  <motion.p variants={item}>Consectetur adipiscing elit. Morbi venenatis lorem quis eros placerat, sit amet
                                    pretium ante hendrerit. Fusce euismod tempus tortor, nec gravida tellus venenatis ac.
                                    In euismod mollis ultricies.
                                  </motion.p>
                                  <motion.button variants={item}>Shop now</motion.button>
                                </motion.div>
                              </div>
                          }
                          <img
                            src={url}
                            style={{ width: "100vw", height: "100%", objectFit:"cover" }}
                            alt="asdada"
                            onClick={hello}
                          />
                        </div>
                        );

                    })}
                  </FadeCarousel>
                </div>
                <div className="classify">
                   {category.map(item=>{
                       return(
                            <div key={item.id}>
                                <div
                                className="category-banner"
                                onMouseEnter={(event)=>this.showShopTag(event)}
                                onMouseLeave={(event)=>this.resetShopTag(event)}
                                >
                                    <img src={item.image} alt="category" height="350" width="400"/>
                                    <div className="shop-action">
                                        <p>{item.name}</p>
                                        <Link to="/">Shop Now</Link>
                                    </div>
                                </div>
                            </div>
                       )
                   })}
                </div>
                <div className="body-banner">
                    <h2>Trending This Week</h2>
                </div>
                <div className="trendy">
                    {/* <OwlCarousel className='owl-theme' loop margin={10} nav={true}>

                            {trends.map(trendy=>{
                                return(
                                <div key={trendy.id} className='item'>
                                    <div onMouseLeave={(event)=>this.resetImage(event, trendy.image_urls)} onMouseEnter={(event)=>this.changeImage(event, trendy.image_urls)} className="trend-template">
                                        <img
                                        ref={this.imageRef}
                                        id={trendy.id}
                                        src={trendy.image_urls[0]}
                                        alt="trendy"
                                        width="200"
                                        height="350"
                                        />
                                        <button className="buttonx">View Detail</button>
                                    </div>
                                    <p>{trendy.name}</p>
                                    <p>{trendy.currency} {trendy.price}</p>
                                </div>
                                )
                        })}

                    </OwlCarousel> */}
                </div>
                <div className="testimony">
                    <div className="testimonials">
                        <h2>Customer Testimonials</h2>
                        <p>Lorem ipsum dolor sit tu consectetur</p>
                    </div>
                </div>
                <div className="chat-btn">
                  <div>
                      <p>How can we help you?</p>
                  </div>
                  <Button tooltip="Ask A Question" className="p-button-raised p-button-rounded" icon="pi pi-comments" iconPos="top"/>
                </div>
            </Navbar>
        )
      }
}

const mapStateToProps = (state, ownProps) => {
    return {
        trends: state.trendingWatches.trends,
        category: state.category.category,
        cart: state.cartItems.cart
    }
}

const mapDispatchToProps = {
    dispatchTrends,
    dispatchCategory
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
