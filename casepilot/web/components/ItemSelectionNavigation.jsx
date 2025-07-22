import PropTypes from "prop-types";
import "./ItemSelectionNavigation.css";


function ItemSelectionNavigation({ 
  onBack, 
  onContinue, 
  disabled = false, 
  backText = "Go back", 
  continueText = "Continue",
  className = "item-selection__navigation",
  backButtonClassName = "item-selection__nav-button item-selection__nav-button--back",
  continueButtonClassName = "item-selection__nav-button item-selection__nav-button--continue",
  tooltip 
}) {
  return (
    <nav className={className}>
      <button
        type="button"
        className={backButtonClassName}
        onClick={onBack}
      >
        {backText}
      </button>
      <button
        type="button"
        className={continueButtonClassName}
        onClick={onContinue}
        disabled={disabled}
        data-tooltip={tooltip}
      >
        {continueText}
      </button>
    </nav>
  );
}

ItemSelectionNavigation.propTypes = {
  onBack: PropTypes.func.isRequired,
  onContinue: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  backText: PropTypes.string,
  continueText: PropTypes.string,
  className: PropTypes.string,
  backButtonClassName: PropTypes.string,
  continueButtonClassName: PropTypes.string,
  tooltip: PropTypes.string
};

export default ItemSelectionNavigation;
