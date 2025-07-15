import Header from "./Header"
import Navigation from "./Navigation"
import ReturnSteps from "./ReturnSteps"

function ItemSelection({step, onNext}) {

    

    return(
        <>
            <Header />
            <Navigation />
            <ReturnSteps currentStep={step}/>
            
        </>
    )
}

export default ItemSelection