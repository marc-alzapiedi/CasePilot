import {
  Text,
  Page,
  Layout,
  Card,
  FormLayout,
  TextField,
  IndexTable,
  Badge,
  useIndexResourceState,
  useBreakpoints,
  Thumbnail,
  InlineStack,
} from "@shopify/polaris";
import { ImageIcon } from "@shopify/polaris-icons";
import { React, useState, useCallback, useEffect } from "react";
import { useAction } from "@gadgetinc/react";
import { api } from "../api";

const ReturnRuleEditor = () => {
  const [value, setValue] = useState("1");
  const [products, setProducts] = useState([]);
  const [productImages, setProductImages] = useState([]);
  const [variants, setProductVariants] = useState([]);
  const [loading, setLoading] = useState(false);

  const [{ data, error, fetching }, updateProduct] = useAction(api.shopifyProduct.update);

  const handleChange = useCallback((newValue) => {
    if (newValue === "" || parseInt(newValue) >= 0) {
      setValue(newValue);
    }
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.getAllProducts();
      console.log(response);
      if (response.result.success) {
        setProducts(response.result.products);
        setProductImages(response.result.images);
        setProductVariants(response.result.variants)
      } else {
        console.error("Failed to fetch products:", response.result.error);
      }
    } catch (error) {
      console.error("Error calling getAllProducts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // console.log(products);

  const resourceName = {
    singular: "product",
    plural: "products",
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(products, {
      resourceFilter: undefined,
    });

  // console.log(productImages)

  // Helper function to find product image by productId
  const getProductImage = (productId) => {
    const productImage = productImages.find(
      (image) => image.productId === productId
    );
    return productImage?.productImage.originalSrc || null;
  };

  // Helper function to find product inventory by productId
  const getProductInventory = (productId) => {
    const productInventory = variants.find((variant) => {

      variant.productId === productId
    });
    return productInventory?.inventoryQuantity || null
  }

  const rowMarkup = products.map(
    ({ id, title, status, ReturnEligibility, vendor }, index) => (
      <IndexTable.Row
        id={id.toString()}
        key={id}
        selected={selectedResources.includes(id.toString())}
        position={index}
      >
        <IndexTable.Cell>
          <InlineStack gap="300" align="start">
            {getProductImage(id) ? (
              <Thumbnail
                source={getProductImage(id)}
                alt={title}
                size="small"
              />
            ) : (
              <Thumbnail source={ImageIcon} alt={title} size="small" />
            )}
            <Text variant="bodyMd" fontWeight="medium">
              {title}
            </Text>
          </InlineStack>
        </IndexTable.Cell>
        <IndexTable.Cell>
          {status === "active" ? (
            <Badge tone="success">
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          ) : status === "draft" ? (
            <Badge tone="info">
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          ) : (
            <Badge>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
          )}
        </IndexTable.Cell>
        <IndexTable.Cell>
          {ReturnEligibility ? (
            <Badge tone="success">Eligible</Badge>
          ) : (
            <Badge tone="critical">Not eligible</Badge>
          )}
        </IndexTable.Cell>
        {/* <IndexTable.Cell>{vendor}</IndexTable.Cell> */}
      </IndexTable.Row>
    )
  );

  const promotedBulkActions = [
    {
      content: "Mark not eligible",
      onAction: async () => {
        try {
          // Update each selected product
          for (const productId of selectedResources) {
            // console.log(selectedResources)
            await updateProduct({
              id: productId,
              ReturnEligibility: false
            });
          }
          
          // Refresh the products list to show updated data
          await fetchProducts();
          
          // Clear selection after successful update
          handleSelectionChange("page", false);
        } catch (error) {
          console.error("Error updating product return eligibility:", error);
        }
      },
    },
    {
      content: 'Mark eligible',
      onAction: async () => {
        try {

          for (const productId of selectedResources) {
            // console.log(selectedResources)
            await updateProduct({
              id: productId,
              ReturnEligibility: true
            });

          }

          await fetchProducts();

          handleSelectionChange("page", false);
        } catch (error) {
          console.error("Error updating product return eligibility", error);
        }
      }
    }
  ];

  // Add this temporarily to debug
  // console.log("Products:", products);
  // console.log("Selected resources:", selectedResources);
  // console.log("First product ID type:", typeof products[0]?.id);



  return (
    <>
      <Page
        fullWidth
        title="Return rule editor"
        subtitle="Define here what are the conditions that will automatically accept or decline a return"
      >
        <Layout>
          <Layout.AnnotatedSection
            id="returnWindow"
            title="Return Window"
            description="Define the time period for which your customers will be able to return an item at full-price."
          >
            <Card roundedAbove="sm">
              <FormLayout>
                <TextField
                  label="Number of days after delivery"
                  type="number"
                  value={value}
                  onChange={handleChange}
                  autoComplete="off"
                  min="0"
                />
              </FormLayout>
            </Card>
          </Layout.AnnotatedSection>
          <Layout.AnnotatedSection
            id="productelegibility"
            title="Product Elegibility"
            description="Flag the products of your store that are not eligible for returns."
          >
            <Card roundedAbove="sm" padding="0">
              <IndexTable
                condensed={useBreakpoints().smDown}
                resourceName={resourceName}
                itemCount={products.length}
                selectedItemsCount={
                  allResourcesSelected ? "All" : selectedResources.length
                }
                onSelectionChange={handleSelectionChange}
                headings={[
                  { title: "Title" },
                  { title: "Status" },
                  { title: "Return Eligibility" },
                  // {title: 'Vendor'},
                ]}
                promotedBulkActions={promotedBulkActions}
              >
                {rowMarkup}
              </IndexTable>
            </Card>
          </Layout.AnnotatedSection>
        </Layout>
      </Page>
    </>
  );
};

export default ReturnRuleEditor;
