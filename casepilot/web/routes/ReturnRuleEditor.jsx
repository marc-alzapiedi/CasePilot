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
} from "@shopify/polaris";
import { React, useState, useCallback, useEffect } from "react";
import { api } from "../api";

const ReturnRuleEditor = () => {
  const [value, setValue] = useState("1");
  const [products, setProducts] = useState([]);
  const [poductImages, setProductImages] = useState([]);
  const [loading, setLoading] = useState(false);

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
    useIndexResourceState(products);

  const rowMarkup = products.map(
    ({ id, title, status, tags, vendor }, index) => (
      <IndexTable.Row
        id={id}
        key={id}
        selected={selectedResources.includes(id)}
        position={index}
      >
        <IndexTable.Cell>{title}</IndexTable.Cell>
        <IndexTable.Cell>
          {status === "active" ? (
            <Badge tone="success">{status}</Badge>
          ) : status === "draft" ? (
            <Badge tone="info">{status}</Badge>
          ) : (
            <Badge >{status}</Badge>
          )}
        </IndexTable.Cell>
        {/* <IndexTable.Cell>{tags}</IndexTable.Cell>
        <IndexTable.Cell>{vendor}</IndexTable.Cell> */}
      </IndexTable.Row>
    )
  );

  const promotedBulkAction = [{
    content: 'Flag item not eligible for return',
    onAction: () => {
      console.log('Todo: Implement api that flags products')
    }
  }]

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
            <Card roundedAbove="sm">
              <IndexTable 
              condensed={useBreakpoints().smDown}
              resourceName={resourceName}
              itemCount={products.length}
              selectedItemsCount={allResourcesSelected ? 'All' : selectedResources.length}
              onSelectionChange={handleSelectionChange}
              headings={[
                {title: 'Title'},
                {title: 'Status'},
                {title: 'Tags'},
                {title: 'Vendor'},
              ]}
              promotedBulkActions={promotedBulkAction}
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
