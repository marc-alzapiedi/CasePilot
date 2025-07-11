import { useState, useEffect } from "react";
import { AutoTable } from "@gadgetinc/react/auto/polaris";
import {
  Banner,
  BlockStack,
  Box,
  Card,
  Layout,
  Link,
  Page,
  Spinner,
  Text,
} from "@shopify/polaris";
import { getApi } from "../api";

const IndexPage = () => {
  const [api, setApi] = useState(null);
  const [apiReady, setApiReady] = useState(false);

  useEffect(() => {
    // Initialize API client
    const initializeApi = async () => {
      try {
        const apiClient = await getApi();
        setApi(apiClient);
        setApiReady(true);
      } catch (error) {
        console.error("Failed to initialize API client:", error);
      }
    };

    initializeApi();
  }, []);

  return (
    <Page title="App">
      <Layout>
        <Layout.Section>
          <Banner tone="success">
            <Text variant="bodyMd" as="p">
              Successfully connected your Gadget app to Shopify
            </Text>
          </Banner>
        </Layout.Section>
        <Layout.Section>
          <Card>
            <BlockStack gap="200" inlineAlign="center">
              <gadget-sparkle-button onClick={() => window.open(`/edit/preview?openShopifyOnboarding=true`, '_top')} style={{ width: "300px", marginTop: "32px", marginBottom: "32px" }}>
                Start building your app
              </gadget-sparkle-button>
              <Text variant="bodyMd" as="p" alignment="center">
                or edit this page's code directly:&nbsp;
                <Link
                  url={`/edit/files/web/routes/index.jsx?openShopifyOnboarding=true`}
                  target="_blank"
                  removeUnderline
                >
                  web/routes/index.jsx
                </Link>
              </Text>
            </BlockStack>
          </Card>
        </Layout.Section>
        <Layout.Section>
          <Card padding="0">
            {!apiReady || !api ? (
              <Box padding="400" inlineAlign="center">
                <Spinner accessibilityLabel="Loading shop data" size="large" />
              </Box>
            ) : (
              <>
                <AutoTable
                  model={api.shopifyShop}
                  columns={["name", "countryName", "currency", "customerEmail"]}
                />
                <Box padding="400">
                  <Text variant="headingMd" as="h6">
                    Shop records fetched from:{" "}
                    <Link
                      url={`/edit/model/DataModel-Shopify-Shop/data`}
                      target="_blank"
                      removeUnderline
                    >
                      api/models/shopifyShop/data
                    </Link>
                  </Text>
                </Box>
              </>
            )}
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default IndexPage;