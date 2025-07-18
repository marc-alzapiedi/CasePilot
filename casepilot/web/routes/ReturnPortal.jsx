import React from "react";
import "../components/ReturnPortal.css"
import { useState } from "react";
import OrderLookup from "../components/OrderLookup";
import ItemSelection from "../components/ItemSelection";

function ReturnPortal() {

    const [step, setStep] = useState(1)
    const [orderData, setOrderData] = useState(null)

    const handleNext = (data, nextStep) => {
        if (nextStep === 2) {
            setOrderData(data)
        }
        setStep(nextStep)
     
    }


    return (
        <>
           {step === 1 && <OrderLookup step = {step} onNext = {(orders) => handleNext(orders, 2)}/>}
           {step === 2 && <ItemSelection step = {step} onNext = {() => setStep(3)} onBack = {() => setStep(1)} orderData = {orderData}/>} 
            
        </>
    );
}

export default ReturnPortal