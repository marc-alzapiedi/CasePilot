import Header from "./Header";
import Navigation from "./Navigation";
import ReturnSteps from "./ReturnSteps";
import { useState } from "react"

function OrderLookup({step, onNext}) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null)
    const [orderNumber, setOrderNumber] = useState('')
    const [isOrderNumberFocused, setIsOrderNumberFocused] = useState(false)

    const handleOrderNumberFocus = () => {
        setIsOrderNumberFocused(true)
        if (orderNumber === '') {
            setOrderNumber('#')
        }
    }

    const handleOrderNumberBlur = () => {
        setIsOrderNumberFocused(false)
        if (orderNumber === '#') {
            setOrderNumber('')
        }
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        setError(null)

        
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const postalCode = formData.get('postalCode');
        const orderNumberValue = orderNumber;
        
        // Basic validation
        if (!email || !postalCode || !orderNumberValue || orderNumberValue === '#') {
            alert('Please fill in all required fields');
            setLoading(false)
            return;
        }

        
        try {
            const res = await fetch("http://localhost:3000/api/lookup-order", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email, postalCode, orderNumber: orderNumberValue})
            })

            if (!res.ok){
                throw new Error (`HTTP error! status: ${res.status}`)
            }
            const result = await res.json()
            // console.log(result)
            
            if (result.success && result.orders !== "No orders found") {
                console.log('Found orders:', result.orders)
                onNext(result)
            } else {
                setError('No orders found matching the provided email, postal code, and order number. Please try again, or contact customer support. ')
                
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
                {error && (
                    <div className="return-form__error">
                        {error}
                    </div>
                )}
                { loading && (
                    <div className="return-form__loading">
                        Loading...
                    </div>
                )}
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
                    
                    <div className="return-form__field">
                        <label htmlFor="orderNumber" className="return-form__label">
                            Order Number
                        </label>
                        <input
                            type="text"
                            id="orderNumber"
                            name="orderNumber"
                            className="return-form__input"
                            value={orderNumber}
                            onChange={(e) => setOrderNumber(e.target.value)}
                            onFocus={handleOrderNumberFocus}
                            onBlur={handleOrderNumberBlur}
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
