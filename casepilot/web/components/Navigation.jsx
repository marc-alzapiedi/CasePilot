function Navigation({ backUrl = "/store", backText = "← Back to store", className = "return-portal" }) {
    return (
        <nav className={`${className}__navigation`}>
            <a 
                href={backUrl}
                className={`${className}__back-link`}
            >
                {backText}
            </a>
        </nav>
    );
}

export default Navigation;
