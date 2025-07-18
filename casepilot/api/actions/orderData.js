import { ActionOptions } from "gadget-server";

export const params = {
    email: { type: "string" },
    postalCode: { type: "string" },
    orderNumber: { type: "string" },
};

/** @type { ActionRun } */
export const run = async ({params, api}) => {

    
    const {email, postalCode, orderNumber } = params

    
    const getOrders = await api.shopifyOrder.findMany({
        filter: { 
            email: { equals: email },
            name: { equals: orderNumber }
        },
        select: {
            id: true,
            name: true,
            email: true,
            totalPrice: true,
            shippingAddress: true,
            billingAddress: true,
            currency: true,
            totalShippingPriceSet: true,
            totalTaxSet: true,
            totalPriceSet: true
        }
    })


    
    const filteredOrders = getOrders.filter((order) => {
        const shippingPostal = order.shippingAddress?.zip
        const billingPostal = order.billingAddress?.zip

        return shippingPostal === postalCode || billingPostal === postalCode 
    })


    console.log(filteredOrders)
    

    let items = []
    if (filteredOrders.length > 0 && filteredOrders[0]?.id) {


        const getOrderLineItems = await api.shopifyOrderLineItem.findMany({
            filter: {
                order: { id: {equals: filteredOrders[0]?.id} }
            },
            select: {
                id: true,
                shop: {
                    id: true
                },
                currentQuantity: true,
                fulfillableQuantity: true,
                title: true,
                product: {
                    id: true,
                },
                price: true,
            }
        })


    
        for (const lineItem of getOrderLineItems) {
    
            let getMedia = await api.shopifyProductMedia.findMany({
                filter: {
                    product: { id: { equals: lineItem.product.id } }
                },
                select: {
                    id: true,
                    file: {
                        id: true
                    }
                }
            });
            

    
            let getImage = await api.shopifyFile.findMany({
                filter: {
                    id: {
                        equals: getMedia[0]?.file?.id
                    }
                },
                select: {
                    image: true,
                }
            })
    
            items.push({
                productImage: getImage[0]?.image || null,
                title: lineItem.title,
                quantity: lineItem.currentQuantity,
                returnEligibility: lineItem.fulfillableQuantity > 0,
                price: lineItem.price
            })
        }

    }





    return {
        success: true,
        orders: (filteredOrders.length > 0 && filteredOrders[0]?.id) ? filteredOrders : "No orders found",
        items: items
    }


    
}



/** @type { ActionOptions } */
export const options = {
    actionType: "create",
    triggers: { api: true }
}

