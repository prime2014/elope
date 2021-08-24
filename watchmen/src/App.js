import { BrowserRouter, Switch, Route } from "react-router-dom";
import HomePage from "./Components/Home/Home.ui";
import Products from "./Components/Products/Products.ui";
import Login from "./Components/Login/Login";
import Cart from "./Components/Cart/Cart.ui";
import Checkout from "./Components/Checkout/Checkout.ui";
import PrimeReact from "../node_modules/primereact/api";
import ProductDetail from "./Components/ProductDetail/Detail";
import AccountActivation from "./Components/activation/AccountActivation";
import SignUp from "./Components/Register/SignUp";
import Payment from "./Components/Payment/Payment";


PrimeReact.ripple = true;

function App() {
  return (
    <BrowserRouter>
        <div className="App">
            <Switch>
                <Route path="/" exact component={ HomePage } />
                <Route exact path="/products" component={ Products } />
                <Route path="/cart" component={ Cart } />
                <Route path="/login" component={ Login } />
                <Route path="/checkout" component= { Checkout } />
                <Route path="/detail/:slug/:id" component={ ProductDetail } />
                <Route path="/activation/:id/:token" component= { AccountActivation } />
                <Route path="/register" component={ SignUp } />
                <Route path="/payment/gateway/:pay" component= { Payment } />
            </Switch>
        </div>
    </BrowserRouter>
  );
}

export default App;
