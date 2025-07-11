import RightArrow from "../assets/svgs/right_arrow_svg";
import React from 'react';

function ReturnSteps({ 
    currentStep = 1, 
    title = "Returns",
    steps = [
        { number: 1, title: "Order Lookup" },
        { number: 2, title: "Item Selection" },
        { number: 3, title: "Return Method" },
        { number: 4, title: "Submit" }
    ]
}) {

    console.log(currentStep)
    return (
        <section className="return-steps">
            <h2 className="return-steps__title">{title}</h2>
            
            <div className="return-steps__container">
                {steps.map((step, index) => (
                    <React.Fragment key={step.number}>
                        <div key={step.number} className="return-steps__step">
                            <span className="return-steps__number">{step.number}</span>
                            <RightArrow state={step.number === currentStep ? currentStep : undefined} />
                            <span className="return-steps__title">{step.title}</span>
                        </div>
                        {index < steps.length - 1 && <div className="return-steps__line"></div>}
                    </React.Fragment>
                ))}
            </div>
        </section>
    );
}

export default ReturnSteps;
