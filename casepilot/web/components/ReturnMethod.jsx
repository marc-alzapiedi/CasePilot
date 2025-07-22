import Header from "./Header";
import Navigation from "./Navigation";
import ReturnSteps from "./ReturnSteps";
import ItemSelectionNavigation from "./ItemSelectionNavigation";
import { useState } from "react";
import "./ReturnMethod.css";

function ReturnMethod({step, onNext, multiStepData, onBack}) {

    console.log(multiStepData)
    
    const [selectedMethod, setSelectedMethod] = useState(null);

    const handleClick = () => {

    }

    const areAllFormsValid = () => {

    }

    const handleMethodSelect = (method) => {
        setSelectedMethod(method);
    }

    const renderMethodInterface = () => {
        switch(selectedMethod) {
            case 'refund':
                return (
                    <div className="method-interface">
                        <h3>Refund Details</h3>
                        {/* Add refund-specific form components here */}
                        <p>Refund interface coming soon...</p>
                    </div>
                );
            case 'exchange':
                return (
                    <div className="method-interface">
                        <h3>Exchange Details</h3>
                        {/* Add exchange-specific form components here */}
                        <p>Exchange interface coming soon...</p>
                    </div>
                );
            case 'store-credit':
                return (
                    <div className="method-interface">
                        <h3>Store Credit Details</h3>
                        {/* Add store credit-specific form components here */}
                        <p>Store credit interface coming soon...</p>
                    </div>
                );
            default:
                return null;
        }
    }

    return (
        <>
        <Header />
        <Navigation />
        <ReturnSteps currentStep={step}/>
        
        <div className="return-method-container">
            <h2>Select Return Method</h2>
            
            <div className="button-group">
                <button 
                    className={`method-button ${selectedMethod === 'refund' ? 'active' : ''}`}
                    onClick={() => handleMethodSelect('refund')}
                >
                    Refund
                </button>
                <button 
                    className={`method-button ${selectedMethod === 'exchange' ? 'active' : ''}`}
                    onClick={() => handleMethodSelect('exchange')}
                >
                    Exchange
                </button>
                <button 
                    className={`method-button ${selectedMethod === 'store-credit' ? 'active' : ''}`}
                    onClick={() => handleMethodSelect('store-credit')}
                >
                    Store Credit
                </button>
            </div>
            
            {renderMethodInterface()}
        </div>

        <ItemSelectionNavigation onBack={onBack} onContinue={handleClick} disabled={!areAllFormsValid()} tooltip={0 === 0 ? "no-items" : "incomplete-forms"}/>

        </>
    )
}

export default ReturnMethod