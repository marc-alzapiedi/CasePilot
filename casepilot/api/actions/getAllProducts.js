/** @type { ActionRun } */
export const run = async ({ params, logger, api, connections, session }) => {
  try {

    const shopId = connections.shopify?.currentShopId

    console.log(shopId)

    if(!shopId) {
      throw new Error("No shop ID found in session")
    }

    // Fetch all products from the shopifyProduct model
    const products = await api.shopifyProduct.findMany({
      filter: {
        shop: {
          id: { equals: shopId }
        }
      },
      select: {
        id: true,
        title: true,
        handle: true,
        status: true,
        vendor: true,
        productType: true,
        tags: true,
        createdAt: true,
        updatedAt: true,
        ReturnEligibility: true
      },
    });

    const getStoreCurrency = await api.shopifyShop.findMany({
      filter: {
        id: { equals: shopId }
      },
      select: {
        currency: true
      }
    })

    const getInventoryTracked = await api.shopifyInventoryItem.findMany({
      filter: {
        shop: {
          id: { equals: shopId}
        }

      },
      select: {
        id: true,
        tracked: true
      }
    })

    let images = [];
    let variants = [];
    for (const product of products) {
      let getVariants = await api.shopifyProductVariant.findMany({
        filter: {
          product: {
            id: { equals: product.id}
          },
          shop: {
            id: { equals: shopId}
          }
        },
        select: {
          price: true,
          inventoryQuantity: true,
          product: {
            id: true
          },
          title: true,
          inventoryItem: {
            id: true
          }
        }

      });



      let getMedia = await api.shopifyProductMedia.findMany({
        filter: {
          product: {
            id: { equals: product.id },
          },
          shop: {
            id: { equals: shopId }
          }
        },
        select: {
          id: true,
          file: {
            id: true,
          },
          product: {
            id: true
          }
        },
      });

      let getImage = await api.shopifyFile.findMany({
        filter: {
          id: { equals: getMedia[0]?.file?.id },
          shop: {
            id: { equals: shopId}
          }
        },
        select: {
          image: true,
          id: true,
        },
      });

      images.push({
        productImage: getImage[0]?.image || null,
        imageId: getImage[0]?.id || null,
        productId: getMedia[0]?.product.id || null

      })

      // getImage.forEach((image) => {
      //   images.push({
      //     productImage: image || null,
      //     imageId: image.id || null,
      //     productId: product.id
      //   })
      //   console.log(image)
      // })


      // variants.push({
      //   product: getVariants[0]?.product,
      //   price: getVariants[0]?.price,
      //   title: getVariants[0]?.title,
      //   inventoryQuantity: getVariants[0]?.inventoryQuantity
      // })

      getVariants.forEach((variant) => {
        variants.push({
          product: variant.product,
          price: variant.price,
          title: variant.title,
          inventoryQuantity: variant.inventoryQuantity
        });
      });

    };


    // const filterInventoryTracked = getInventoryTracked.filter((inventory) => {
    //   const tracked = inventory.id

    //   return 
    // })

    logger.info(`Retrieved ${products.length} products`);

    return {
      result: {
        success: true,
        products: products,
        count: products.length,
        images: images,
        variants: variants,
        shopId: shopId,
        storeCurrency: getStoreCurrency[0]
      },
    };
  } catch (error) {
    logger.error("Error fetching products:", error);

    return {
      result: {
        success: false,
        error: error.message,
        products: [],
      },
    };
  }
};
