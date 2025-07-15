import { useState } from 'react';
import OrderLookup from '../components/OrderLookup';

export default function ReturnsPage() {
    const [step, setStep] = useState(1);
    const [orders, setOrders] = useState(null);

    const handleNext = (foundOrders) => {
        setOrders(foundOrders);
        setStep(2);
        // Handle next step logic here
    };

    return (
        <div>
            <OrderLookup step={step} onNext={handleNext} />
        </div>
    );
}
