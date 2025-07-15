export function initMiddleware(middleware) {
    return (req, res) => {
        return new Promise((resolve, reject) => {
            middleware(req, res, (result) => 
                result instanceof Error ? reject(result) : resolve(result)
            )
        })
    }
}