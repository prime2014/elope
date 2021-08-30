import React from "react";
import { connect } from "react-redux";
import { InputNumber } from 'primereact/inputnumber';
import { deleteCartItem, dispatchCartItemDelete, dispatchUpdate, addItemToCart } from "../redux/actions";
import { cartItemsDispatch, dispatchUpdateCartItem } from "../redux/dispatchActions";
import toast, { Toaster } from "react-hot-toast";
import { Button } from 'primereact/button';
import { cartAPI } from "../services/cart/cart.service";

const CartAddSubtractBtn = props => {

    const handleUpdateValue = (event, rowData)=>{
        let value = event.target.value;
        rowData.quantity = value;
        rowData.net_total = rowData.quantity * rowData.price;
        props.dispatchUpdate(rowData)
    }

    const handleValueChange = (event, item) => {
        console.log(item.item)
        let data = { product: item.item, quantity: event.target.value}
        toast.promise(props.dispatchUpdateCartItem(event.target.name, data),{
            loading: "Updating Cart Item...",
            success: "Cart Item was updated successfully",
            error: "There was a problem updating the cart item"
        },
        {
            style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
            },
        }
        )
    }

    const submitToCart = watch=>{
        let product = {
            product_name: watch.name,
            item: watch.id,
            currency: watch.currency,
            quantity: 1,
            price: watch.price,
            net_total: watch.price,
            image_urls: watch.image_urls
        }
        props.addItemToCart(product);
        toast.success("Item was successfully added to cart",
            {
                style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
                },
            }
        )

    }

    const submitToBackend = product => {
        toast.promise(cartAPI.addToCart({ item: product.id }),{
            loading: "Adding item to cart",
            success: (data)=>{
               props.addItemToCart(data);
               return "Item was successfully added to cart!"
            },
            error: "Item could not be added to cart"
        }, {
            style: {
               borderRadius: '10px',
               background: '#333',
               color: '#fff',
            },
        })
    }

    return (
        <>
         <Toaster />
         {props.rowData ?
         <>
            { props.login ?
                    <>
                        <InputNumber name={props.rowData.id} inputClassName="demon" min={1} id="quantity" showButtons buttonLayout="stacked"
                        decrementButtonClassName="darrent" step={1} incrementButtonClassName="darrent" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus"
                        value={props.rowData.quantity} onValueChange={(event)=> handleValueChange(event, props.rowData)} />
                    </>
               :
                    <>
                        <InputNumber name={props.rowData.item} inputClassName="demon" min={1} id="quantity" showButtons buttonLayout="stacked"
                        decrementButtonClassName="darrent" step={1} incrementButtonClassName="darrent" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus"
                        value={props.rowData.quantity} onValueChange={(event)=>handleUpdateValue(event, props.rowData)} />
                    </>
            }
         </>
         :
          <Button onClick={props.login ? ()=>submitToBackend(props.product) : ()=>submitToCart(props.product) } className="pd-cart" label="Add To Cart" icon="pi pi-shopping-cart" iconPos="left" />
        }
        </>
    );
}


const mapStateToProps = (state, ownProps) => {
    return {
        login: state.login.login,
        product: state.productDetail.product,
    }
}

const mapDispatchToProps = {
    dispatchUpdate,
    dispatchUpdateCartItem,
    addItemToCart
}


export default connect(mapStateToProps, mapDispatchToProps)(CartAddSubtractBtn);
