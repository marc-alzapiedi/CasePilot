import React from "react";
import "../components/ReturnPortal.css"
import { useState, useEffect } from "react";
import OrderLookup from "../components/OrderLookup";
import ItemSelection from "../components/ItemSelection";
import ReturnMethod from "../components/ReturnMethod";

function ReturnPortal() {

    const [step, setStep] = useState(() => {
        const savedStep = localStorage.getItem('returnPortalStep');
        return savedStep ? parseInt(savedStep) : 1;
    })
    const [multiStepData, setMultiStepData] = useState(() => {
        const savedData = localStorage.getItem('returnPortalData');
        return savedData ? JSON.parse(savedData) : {};
    })

    useEffect(() => {
        localStorage.setItem('returnPortalStep', step.toString());
    }, [step]);

    useEffect(() => {
        localStorage.setItem('returnPortalData', JSON.stringify(multiStepData));
    }, [multiStepData]);

    const handleNext = (data, nextStep) => {
        if (nextStep === 2) {
            setMultiStepData({ ...multiStepData, step1: data })
        }
        if (nextStep === 3) {
            // Add the logic here 
            setMultiStepData({ ...multiStepData, step2: data})
        }
        setStep(nextStep)
     
    }

    // console.log(multiStepData)

    


    return (
        <>
           {step === 1 && <OrderLookup step = {step} onNext = {(orders) => handleNext(orders, 2)}/>}
           {step === 2 && <ItemSelection step = {step} onNext = {(items) => handleNext(items, 3)} onBack = {() => setStep(1)} multiStepData = {multiStepData}/>}
           {step === 3 && <ReturnMethod step={step} onNext = {() => setStep(4)} onBack = {() => setStep(2)} multiStepData={multiStepData}/>} 
            
        </>
    );
}

export default ReturnPortal