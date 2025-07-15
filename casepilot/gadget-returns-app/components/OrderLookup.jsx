import RightArrow from "../assets/svgs/right_arrow_svg";
import Header from "./Header";
import Navigation from "./Navigation";
import ReturnSteps from "./ReturnSteps";
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
            setError('Please fill in all required fields');
            setLoading(false)
            return;
        }

        try {
            const res = await fetch("/api/lookup-order", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email, postalCode})
            })

            if (!res.ok){
                throw new Error (`HTTP error! status: ${res.status}`)
            }
            const result = await res.json()
            
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
                {error && <div className="error-message">{error}</div>}
                <form className="return-form__container" onSubmit={onSubmit}>
                    // ...existing form fields...
                    <button type="submit" className="return-form__submit" disabled={loading}>
                        {loading ? 'Loading...' : 'Continue'}
                    </button>
                </form>
            </section>
        </>
    )
}

export default OrderLookup
