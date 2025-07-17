import { useState } from 'react'
import Header from "./Header"
import Navigation from "./Navigation"
import ReturnSteps from "./ReturnSteps"
import './ItemSelection.css'

function ItemSelection({step, onNext, orderData}) {
    const [selectedItem, setSelectedItem] = useState(null)
    const [formData, setFormData] = useState({
        quantity: 1,
        reason: '',
        comment: '',
        photo: null
    })

    const handleItemSelect = (item, index) => {
        setSelectedItem({ ...item, index })
        setFormData({
            quantity: 1,
            reason: '',
            comment: '',
            photo: null
        })
    }

    const handleFormChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0]
        setFormData(prev => ({
            ...prev,
            photo: file
        }))
    }

    console.log(orderData)
    
    return(
        <>
            <Header />
            <Navigation />
            <ReturnSteps currentStep={step}/>
            
            <div className="item-selection">
                <h2 className="item-selection__title">Select Items to Return</h2>
                <ul className="item-selection__list">
                    {orderData?.items?.map((item, index) => (
                        <li 
                            key={index} 
                            className={`item-selection__item ${selectedItem?.index === index ? 'item-selection__item--selected' : ''}`}
                            onClick={() => handleItemSelect(item, index)}
                        >
                            <img 
                                src={item.productImage?.originalSrc} 
                                alt={item.title}
                                className="item-selection__image"
                            />
                            <div className="item-selection__content">
                                <h3 className="item-selection__product-title">{item.title}</h3>
                                <p className="item-selection__quantity">Quantity: {item.quantity}</p>
                                <p className="item-selection__price">Price: ${item.price}</p>
                            </div>
                        </li>
                    ))}
                </ul>

                {selectedItem && (
                    <div className="item-selection__form">
                        <h3 className="item-selection__form-title">Return Details for: {selectedItem.title}</h3>
                        
                        {selectedItem.quantity > 1 && (
                            <div className="item-selection__form-field">
                                <label className="item-selection__form-label">
                                    Quantity to Return (max {selectedItem.quantity}):
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max={selectedItem.quantity}
                                    value={formData.quantity}
                                    onChange={(e) => handleFormChange('quantity', parseInt(e.target.value))}
                                    className="item-selection__form-input"
                                />
                            </div>
                        )}

                        <div className="item-selection__form-field">
                            <label className="item-selection__form-label">Return Reason:</label>
                            <select
                                value={formData.reason}
                                onChange={(e) => handleFormChange('reason', e.target.value)}
                                className="item-selection__form-select"
                            >
                                <option value="">Select a reason</option>
                                <option value="too-big">Too big</option>
                                <option value="damaged">Damaged</option>
                                <option value="changed-mind">Changed mind</option>
                                <option value="wrong-product">Ordered wrong product</option>
                            </select>
                        </div>

                        {formData.reason === 'damaged' && (
                            <div className="item-selection__form-field">
                                <label className="item-selection__form-label">Upload Photo of Damage:</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoUpload}
                                    className="item-selection__form-file"
                                />
                            </div>
                        )}

                        <div className="item-selection__form-field">
                            <label className="item-selection__form-label">Additional Comments (Optional):</label>
                            <textarea
                                value={formData.comment}
                                onChange={(e) => handleFormChange('comment', e.target.value)}
                                placeholder="Add any additional details..."
                                className="item-selection__form-textarea"
                                rows="3"
                            />
                        </div>

                        <div className="item-selection__form-actions">
                            <button 
                                type="button"
                                className="item-selection__form-button item-selection__form-button--cancel"
                                onClick={() => setSelectedItem(null)}
                            >
                                Cancel
                            </button>
                            <button 
                                type="button"
                                className="item-selection__form-button item-selection__form-button--add"
                                disabled={!formData.reason}
                            >
                                Add to Return
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default ItemSelection