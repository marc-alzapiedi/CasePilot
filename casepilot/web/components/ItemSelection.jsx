import { useState, useRef, useEffect } from "react";
import Header from "./Header";
import Navigation from "./Navigation";
import ReturnSteps from "./ReturnSteps";
import "./ItemSelection.css";

function ItemSelection({ step, onNext, orderData, onBack }) {
  const [selectedItems, setSelectedItems] = useState([]);
  const [formDataMap, setFormDataMap] = useState({});
  const formRef = useRef(null);

  const handleItemSelect = (item, index) => {
    setSelectedItems((prev) => {
      const isSelected = prev.find(
        (selectedItem) => selectedItem.index === index
      );

      if (isSelected) {
        // Remove item from selection
        const newSelected = prev.filter(
          (selectedItem) => selectedItem.index !== index
        );

        // Remove form data for this item
        setFormDataMap((prevFormData) => {
          const newFormData = { ...prevFormData };
          delete newFormData[index];
          return newFormData;
        });

        return newSelected;
      } else {
        // Add item to selection
        const newSelected = [...prev, { ...item, index }];

        // Initialize form data for this item
        setFormDataMap((prevFormData) => ({
          ...prevFormData,
          [index]: {
            quantity: 1,
            reason: "",
            comment: "",
            photo: null,
          },
        }));

        return newSelected;
      }
    });
  };

  const handleCancel = (itemIndex) => {
    setSelectedItems((prev) => prev.filter((item) => item.index !== itemIndex));
    setFormDataMap((prevFormData) => {
      const newFormData = { ...prevFormData };
      delete newFormData[itemIndex];
      return newFormData;
    });

    // requestAnimationFrame(() => {
    //   const itemList = document.querySelector(".item-selection__list");
    //   if (itemList) {
    //     itemList.scrollIntoView({
    //       behavior: "smooth",
    //       block: "end",
    //     });
    //   }
    // });
  };

  const handleFormChange = (itemIndex, field, value) => {
    setFormDataMap((prev) => ({
      ...prev,
      [itemIndex]: {
        ...prev[itemIndex],
        [field]: value,
      },
    }));
  };

  const handlePhotoUpload = (itemIndex, e) => {
    const file = e.target.files[0];
    setFormDataMap((prev) => ({
      ...prev,
      [itemIndex]: {
        ...prev[itemIndex],
        photo: file,
      },
    }));
  };

  const formatCurrency = (amount, currency) => {
    const numAmount = parseFloat(amount);

    if (currency === "EUR") {
      // European format: 2.249,85 €
      return numAmount.toLocaleString("de-DE", {
        style: "currency",
        currency: "EUR",
      });
    } else if (currency === "USD") {
      // US format: $2,249.85
      return numAmount.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
    } else {
      // Default fallback
      return `${currency} ${numAmount.toFixed(2)}`;
    }
  };

  useEffect(() => {
    if (selectedItems.length > 0 && formRef.current) {
      requestAnimationFrame(() => {
        // Find the last form element within the container
        const lastForm = formRef.current.querySelector(
          ".item-selection__form:last-child"
        );
        if (lastForm) {
          lastForm.scrollIntoView({
            behavior: "smooth",
            block: "end",
          });
        } else {
          // Fallback: scroll to bottom of container
          formRef.current.scrollIntoView({
            behavior: "smooth",
            block: "end",
          });
        }
      });
    }
  }, [selectedItems]);

  return (
    <>
      <Header />
      <Navigation />
      <ReturnSteps currentStep={step} />

      <div className="item-selection">
        <h2 className="item-selection__title">Select Items to Return</h2>

        <ul className="item-selection__list">
          {orderData?.items?.map((item, index) => (
            <li
              key={index}
              className={`item-selection__item ${
                selectedItems.find(
                  (selectedItem) => selectedItem.index === index
                )
                  ? "item-selection__item--selected"
                  : ""
              }`}
              onClick={() => handleItemSelect(item, index)}
            >
              <img
                src={item.productImage?.originalSrc}
                alt={item.title}
                className="item-selection__image"
              />
              <div className="item-selection__content">
                <h3 className="item-selection__product-title">{item.title}</h3>
                <p className="item-selection__quantity">
                  Quantity: {item.quantity}
                </p>
                <p className="item-selection__price">
                  Price:{" "}
                  {formatCurrency(
                    item.price * item.quantity,
                    orderData?.orders[0]?.currency || "USD"
                  )}
                </p>
              </div>
            </li>
          ))}
        </ul>

        {/* <div className="item-selection__order-summary">
                    <h3 className="item-selection__order-summary-title">Order Summary</h3>
                    <div className="item-selection__order-summary-line">
                        <span>Taxes:</span>
                        <span>{formatCurrency(orderData?.orders[0]?.totalTaxSet?.shop_money?.amount || 0, orderData?.orders[0]?.currency || 'USD')}</span>
                    </div>
                    <div className="item-selection__order-summary-line">
                        <span>Shipping:</span>
                        <span>{formatCurrency(orderData?.orders[0]?.totalShippingPriceSet?.shop_money?.amount || 0, orderData?.orders[0]?.currency || 'USD')}</span>
                    </div>
                    <div className="item-selection__order-summary-line item-selection__order-summary-total">
                        <span>Total:</span>
                        <span>{formatCurrency(orderData?.orders[0]?.totalPriceSet?.shop_money?.amount || 0, orderData?.orders[0]?.currency || 'USD')}</span>
                    </div>
                </div> */}

        {selectedItems.length > 0 && (
          <div className="item-selection__forms" ref={formRef}>
            {selectedItems.map((selectedItem) => (
              <div key={selectedItem.index} className="item-selection__form">
                <h3 className="item-selection__form-title">
                  Return Details for: {selectedItem.title}
                </h3>

                {selectedItem.quantity > 1 && (
                  <div className="item-selection__form-field">
                    <label className="item-selection__form-label">
                      Quantity to Return (max {selectedItem.quantity}):
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={selectedItem.quantity}
                      value={formDataMap[selectedItem.index]?.quantity || 1}
                      onChange={(e) =>
                        handleFormChange(
                          selectedItem.index,
                          "quantity",
                          parseInt(e.target.value)
                        )
                      }
                      className="item-selection__form-input"
                    />
                  </div>
                )}

                <div className="item-selection__form-field">
                  <label className="item-selection__form-label">
                    Return Reason:
                  </label>
                  <select
                    value={formDataMap[selectedItem.index]?.reason || ""}
                    onChange={(e) =>
                      handleFormChange(selectedItem.index, "reason", e.target.value)
                    }
                    className="item-selection__form-select"
                  >
                    <option value="">Select a reason</option>
                    <option value="too-big">Too big</option>
                    <option value="damaged">Damaged</option>
                    <option value="changed-mind">Changed mind</option>
                    <option value="wrong-product">Ordered wrong product</option>
                  </select>
                </div>

                {formDataMap[selectedItem.index]?.reason === "damaged" && (
                  <div className="item-selection__form-field">
                    <label className="item-selection__form-label">
                      Upload Photo of Damage:
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePhotoUpload(selectedItem.index, e)}
                      className="item-selection__form-file"
                    />
                  </div>
                )}

                <div className="item-selection__form-field">
                  <label className="item-selection__form-label">
                    Additional Comments (Optional):
                  </label>
                  <textarea
                    value={formDataMap[selectedItem.index]?.comment || ""}
                    onChange={(e) =>
                      handleFormChange(selectedItem.index, "comment", e.target.value)
                    }
                    placeholder="Add any additional details..."
                    className="item-selection__form-textarea"
                    rows="3"
                  />
                </div>

                <div className="item-selection__form-actions">
                  <button
                    type="button"
                    className="item-selection__form-button item-selection__form-button--cancel"
                    onClick={() => handleCancel(selectedItem.index)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="item-selection__form-button item-selection__form-button--add"
                    disabled={!formDataMap[selectedItem.index]?.reason}
                  >
                    Continue
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedItems.length === 0 && (
          <div className="item-selection__navigation">
            <button
              type="button"
              className="item-selection__nav-button item-selection__nav-button--back"
              onClick={onBack}
            >
              Go back
            </button>
            <button
              type="button"
              className="item-selection__nav-button item-selection__nav-button--continue"
              onClick={onNext}
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default ItemSelection;
