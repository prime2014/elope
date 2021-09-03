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
import { motion } from "framer-motion";
import cookies from "react-cookies";
import AlarmClock from "../../images/clocks/alarm-clock.jpg";
import Alarm from "../../images/clocks/alarm.jpg";
import Andie from "../../images/clocks/andie.jpg";
import Engstrom from "../../images/clocks/engstrom.jpg";
import Peonies from "../../images/clocks/peonies.jpg";
import Phillip from "../../images/clocks/phillips.jpg";
import Portable from "../../images/clocks/portable.jpg";
import Smart from "../../images/brands/smart-clokc-lenovo.jpg";
import Testimonials from "../../common/Testimonials";
import { Carousel } from 'primereact/carousel';


class Home extends Component {
      constructor(props){
           super(props);
           this.state = {
             activeIndex: 0
           }
           this.imageRef = React.createRef();
      }

      componentDidMount(){
        let { order } = this.props;
        this.props.dispatchCategory();
        if(Object.keys(order).length <=0 && cookies.load("authToken")){

        }
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
          let { category, cart } = this.props;



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

          const responsiveOptions = [
            {
                breakpoint: '1024px',
                numVisible: 3,
                numScroll: 3
            },
            {
                breakpoint: '768px',
                numVisible: 2,
                numScroll: 2
            },
            {
                breakpoint: '560px',
                numVisible: 1,
                numScroll: 1
            }
        ]

          const products = [
            {
              name: "Alarm Clock",
              image: AlarmClock,
            },
            {
              name: "Alarm Clock",
              image: Alarm,
            },
            {
              name: "Alarm Clock",
              image: Andie,
            },
            {
              name: "Alarm Clock",
              image: Engstrom,
            },
            {
              name: "Alarm Clock",
              image: Peonies,
            },
            {
              name: "Alarm Clock",
              image: Phillip,
            },
            {
              name: "Alarm Clock",
              image: Portable,
            },
            {
              name: "Alarm Clock",
              image: Smart,
            }

          ]

          const itemTemplate = (item) => {
            return(
              <div className="clock">
                <img className="samply" src={item.image} width="100%" height="350" alt="product" />
                <p className="text-center">{item.name}</p>
              </div>
            )
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
                              <motion.button className="shop_now_btn">Shop now</motion.button>
                            </div> :
                              <div className="second">
                                <h4>Watch Sale</h4>
                                <motion.h1>Up To One Year Warranty</motion.h1>
                                <motion.div>
                                  <motion.p variants={item}>Consectetur adipiscing elit. Morbi venenatis lorem quis eros placerat, sit amet
                                    pretium ante hendrerit. Fusce euismod tempus tortor, nec gravida tellus venenatis ac.
                                    In euismod mollis ultricies.
                                  </motion.p>
                                  <motion.button className="shop_now_btn" variants={item}>Shop now</motion.button>
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
                <div className="trendy">
                <h3>Trending This Week</h3>
                <Carousel responsiveOptions={responsiveOptions} autoplayInterval="3500" circular={false} value={products} itemTemplate={itemTemplate} numVisible={4} numScroll={1}></Carousel>
                </div>
                <div className="testimony">
                    <div className="testimonials">
                        <h2>Customer Testimonials</h2>
                        <p>We value your feedback</p>
                        <Testimonials />
                    </div>
                </div>
                <div className="px-5 py-5 features">
                <div className="text-center">
                    <div className="mb-3 font-bold text-2xl">
                        <span className="text-700">One Product, </span>
                        <span className="text-blue-600">Many Solutions</span>
                    </div>
                    <div className="text-700 text-sm mb-6">Ac turpis egestas maecenas pharetra convallis posuere morbi leo urna.</div>
                    <div className="grid">
                        <div className="col-12 col-md-4 mb-4 px-5">
                            <span className="p-3 shadow-2 mb-3 inline-block bg-white" style={{ borderRadius: '10px' }}>
                                <i className="pi pi-desktop text-4xl text-blue-500"></i>
                            </span>
                            <div className="text-900 mb-3 font-medium">Book for customization</div>
                            <span className="text-700 text-sm line-height-3">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</span>
                        </div>
                        <div className="col-12 col-md-4 mb-4 px-5">
                            <span className="p-3 shadow-2 mb-3 inline-block bg-white" style={{ borderRadius: '10px' }}>
                                <i className="pi pi-lock text-4xl text-blue-500"></i>
                            </span>
                            <div className="text-900 mb-3 font-medium">Secure Payment</div>
                            <span className="text-700 text-sm line-height-3">Risus nec feugiat in fermentum posuere urna nec. Posuere sollicitudin aliquam ultrices sagittis.</span>
                        </div>
                        <div className="col-12 col-md-4 mb-4 px-5">
                            <span className="p-3 shadow-2 mb-3 inline-block bg-white" style={{ borderRadius: '10px' }}>
                                <i className="pi pi-check-circle text-4xl text-blue-500"></i>
                            </span>
                            <div className="text-900 mb-3 font-medium">Sell With Us</div>
                            <span className="text-700 text-sm line-height-3">Ornare suspendisse sed nisi lacus sed viverra tellus. Neque volutpat ac tincidunt vitae semper.</span>
                        </div>
                        <div className="col-12 col-md-4 mb-4 px-5">
                            <span className="p-3 shadow-2 mb-3 inline-block bg-white" style={{ borderRadius: '10px' }}>
                                <i className="pi pi-globe text-4xl text-blue-500"></i>
                            </span>
                            <div className="text-900 mb-3 font-medium">Global Shipping</div>
                            <span className="text-700 text-sm line-height-3">Fermentum et sollicitudin ac orci phasellus egestas tellus rutrum tellus.</span>
                        </div>
                        <div className="col-12 col-md-4 mb-4 px-5">
                            <span className="p-3 shadow-2 mb-3 inline-block bg-white" style={{ borderRadius: '10px' }}>
                                <i className="pi pi-github text-4xl text-blue-500"></i>
                            </span>
                            <div className="text-900 mb-3 font-medium">Open Source</div>
                            <span className="text-700 text-sm line-height-3">Nec tincidunt praesent semper feugiat. Sed adipiscing diam donec adipiscing tristique risus nec feugiat. </span>
                        </div>
                        <div className="col-12 col-md-4 md:mb-4 mb-0 px-3">
                            <span className="p-3 shadow-2 mb-3 inline-block bg-white" style={{ borderRadius: '10px' }}>
                                <i className="pi pi-shield text-4xl text-blue-500"></i>
                            </span>
                            <div className="text-900 mb-3 font-medium">Trusted Securitty</div>
                            <span className="text-700 text-sm line-height-3">Mattis rhoncus urna neque viverra justo nec ultrices. Id cursus metus aliquam eleifend.</span>
                        </div>
                    </div>
                </div>
                </div>
                <div>
                  <div className="clock-carousel py-3">
                    <h3 className="text-center py-4">You May Like</h3>
                    <Carousel responsiveOptions={responsiveOptions} autoplayInterval="3500" circular={false} value={products} itemTemplate={itemTemplate} numVisible={4} numScroll={1}></Carousel>
                  </div>
                </div>
                {/* <div className="chat-btn">
                  <div>
                      <p>How can we help you?</p>
                  </div>
                  <Button tooltip="Ask A Question" className="p-button-raised p-button-rounded" icon="pi pi-comments" iconPos="top"/>
                </div> */}
            </Navbar>
        )
      }
}

const mapStateToProps = (state, ownProps) => {
    return {
        trends: state.trendingWatches.trends,
        category: state.category.category,
        cart: state.cartItems.cart,
        order: state.orderDetail.order
    }
}

const mapDispatchToProps = {
    dispatchTrends,
    dispatchCategory
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
