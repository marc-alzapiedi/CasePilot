import RightArrow from "../assets/svgs/right_arrow_svg";
import Header from "./Header";
import Navigation from "./Navigation";
import ReturnSteps from "./ReturnSteps";
import { Client } from "@gadget-client/casepilot"
import { useState } from "react"

function OrderLookup({step, onNext}) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null)

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        setError(null)

        
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const postalCode = formData.get('postalCode');
        
        // Basic validation
        if (!email || !postalCode) {
            alert('Please fill in all required fields');
            setLoading(false)
            return;
        }

        
        try {

            // console.log(email, postalCode)
           
            const res = await fetch("http://localhost:3000/api/lookup-order", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email, postalCode})
            })

            if (!res.ok){
                throw new Error (`HTTP error! status: ${res.status}`)
            }
            const result = await res.json()
            console.log(result)
            
            if (result.success && result.orders.length > 0) {
                console.log('Found orders:', result.orders)
                onNext(result.orders)
            } else {
                setError('No orders found matching the provided email and postal code')
                
            }

            
             
        } catch (err){
            console.error('Order lookup failed:', err)
            setError('Failed to lookup orders. Please try again.')
        } finally {
            setLoading(false)
        }

    }

    return(
        <>
            <Header />
            <Navigation />
            <ReturnSteps currentStep={step} />
            <section className="return-form">
                <h2 className="return-form__title">Order Information</h2>
                <form className="return-form__container" onSubmit={onSubmit}>
                    <div className="return-form__field">
                        <label htmlFor="email" className="return-form__label">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="return-form__input"
                            required
                        />
                    </div>
                    
                    <div className="return-form__field">
                        <label htmlFor="postalCode" className="return-form__label">
                            Postal Code
                        </label>
                        <input
                            type="text"
                            id="postalCode"
                            name="postalCode"
                            className="return-form__input"
                            required
                        />
                    </div>
                    
                    <button type="submit" className="return-form__submit" >
                        Continue
                    </button>
                </form>
            </section>
        </>
    )
}

export default OrderLookup
