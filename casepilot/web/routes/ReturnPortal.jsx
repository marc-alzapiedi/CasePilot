import React from "react";
import "../components/ReturnPortal.css"
import { useState } from "react";
import OrderLookup from "../components/OrderLookup";
import ItemSelection from "../components/ItemSelection";

function ReturnPortal() {

    const [step, setStep] = useState(1)
    const [multiStepData, setMultiStepData] = useState({ })

    const handleNext = (data, nextStep) => {
        if (nextStep === 2) {
            setMultiStepData({ ...multiStepData, step1: data })
        }
        if (nextStep === 3) {
            // Add the logic here 
        }
        setStep(nextStep)
     
    }

    console.log(multiStepData)

    


    return (
        <>
           {step === 1 && <OrderLookup step = {step} onNext = {(orders) => handleNext(orders, 2)}/>}
           {step === 2 && <ItemSelection step = {step} onNext = {() => setStep(3)} onBack = {() => setStep(1)} multiStepData = {multiStepData}/>} 
            
        </>
    );
}

export default ReturnPortal