import React from "react";
import { connect } from "react-redux";
import { InputNumber } from 'primereact/inputnumber';


const CartAddSubtractBtn = props => {

    return (
        props.login ?
                <>
                    <InputNumber name={props.rowData.id} inputClassName="demon" min={1} id="quantity" showButtons buttonLayout="stacked"
                    decrementButtonClassName="darrent" step={1} incrementButtonClassName="darrent" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus"
                    value={props.rowData.quantity} onValueChange={(event)=>props.changeValueAPI(event, props.rowData)} />
                </>
           :
                <>
                    <InputNumber name={props.rowData.item} inputClassName="demon" min={1} id="quantity" showButtons buttonLayout="stacked"
                    decrementButtonClassName="darrent" step={1} incrementButtonClassName="darrent" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus"
                    value={props.rowData.quantity} onValueChange={(event)=>props.changeValue(event, props.rowData)} />
                </>


    );
}


const mapStateToProps = (state, ownProps) => {
    return {
        login: state.login.login
    }
}


export default connect(mapStateToProps, null)(CartAddSubtractBtn);
