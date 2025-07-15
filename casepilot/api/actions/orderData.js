
import { ActionOptions } from "gadget-server";

/** @type { ActionRun } */
export const run = async ({params, api}) => {

    console.log(params)
    const {email, postalCode } = params

    const getOrders = await api.shopifyOrder.findMany({
        filter: { 
            email: { equals: email } 
        },
        select: {
            id: true,
            name: true,
            email: true,
            totalPrice: true,
            shippingAddress: true,
            billingAddress: true,
        }
    })

    
    const filteredOrders = getOrders.filter((order) => {
        const shippingPostal = order.shippingAddress?.zip
        const billingPostal = order.billingAddress?.zip

        return shippingPostal === postalCode || billingPostal === postalCode
    })




    return {
        success: true,
        orders: filteredOrders
    }


    
}



/** @type { ActionOptions } */
export const options = {
    actionType: "global",
    triggers: { api: true }
}

export const params = {
    email: { type: "string", required: true },
    postalCode: { type: "string", required: true }
};
