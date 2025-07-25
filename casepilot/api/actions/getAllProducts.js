/** @type { ActionRun } */
export const run = async ({ params, logger, api, connections }) => {
  try {
    // Fetch all products from the shopifyProduct model
    const products = await api.shopifyProduct.findMany({
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

    let images = []
    let price = []
    for (const product of products) {
      let getPrice = await api.shopifyProductVariant.findMany({
        filter: {
          product: {
            id: { equals: product.id}
          }
        },
        select: {
          price: true,
          inventoryQuantity: true,
          product: {
            id: true
          }
        }

      });

      let getMedia = await api.shopifyProductMedia.findMany({
        filter: {
          product: {
            id: { equals: product.id },
          },
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

      price.push({
        price: getPrice[0]
      })
    }


    logger.info(`Retrieved ${products.length} products`);

    return {
      result: {
        success: true,
        products: products,
        count: products.length,
        images: images,
        price: price
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
