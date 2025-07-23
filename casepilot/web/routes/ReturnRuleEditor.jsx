import {
  Text,
  Page,
  Layout,
  Card,
  FormLayout,
  TextField,
} from "@shopify/polaris";
import { React, useState, useCallback } from "react";

const ReturnRuleEditor = () => {
  const [value, setValue] = useState("1");

  const handleChange = useCallback((newValue) => {
    if (newValue === "" || parseInt(newValue) >= 0) {
      setValue(newValue);
    }
  }, []);

  return (
    <>
      <Page fullWidth>
        <Text variant="heading2xl" as="p">
          Return Rule Editor
        </Text>
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
              {/* <FormLayout>
                <TextField
                  label="Number of days after delivery"
                  type="number"
                  value={value}
                  onChange={handleChange}
                  autoComplete="off"
                  min="0"
                />
              </FormLayout> */}
            </Card>
          </Layout.AnnotatedSection>
        </Layout>
      </Page>
    </>
  );
};

export default ReturnRuleEditor;
