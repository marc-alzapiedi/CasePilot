

function Header({ logoSrc = "/path/to/your/logo.png", logoAlt = "Company Logo", className = "return-portal" }) {

    return (
        <header className={className}>
            <img 
                src={logoSrc} 
                alt={logoAlt} 
                className={`${className}__logo`}
            />
        </header>
    );
}

export default Header;
