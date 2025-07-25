import React, { lazy, Suspense } from "react";
import { Box, Card, Page, Spinner, Text } from "@shopify/polaris";
import { useEffect } from "react";
import {
  Link,
  Outlet,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  useLocation,
  useNavigate,
} from "react-router";
import { getApi } from "../api";
const IndexPage = lazy(() => import("../routes/index"));
import ReturnRuleEditor from "../routes/ReturnRuleEditor";
import "./App.css";
import ReturnPortal from "../routes/ReturnPortal";
import { NavMenu } from "@shopify/app-bridge-react";

function Error404() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const appURL = process.env.GADGET_PUBLIC_SHOPIFY_APP_URL;

    if (appURL && location.pathname === new URL(appURL).pathname) {
      navigate("/", { replace: true });
    }
  }, [location.pathname]);

  return <div>404 not found</div>;
}

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/returns" element={<StandAloneReturnPortal />} />
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              <Suspense
                fallback={
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                    <Spinner accessibilityLabel="Loading page" size="large" />
                  </div>
                }
              >
                <IndexPage />
              </Suspense>
            }
          />
          <Route path="*" element={<Error404 />} />
        </Route>
        <Route path="/return-rule-editor" element={<Layout />}>
          <Route
            index
            element={
              <Suspense
                fallback={
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                    <Spinner accessibilityLabel="Loading page" size="large" />
                  </div>
                }
              >
                <ReturnRuleEditor />
              </Suspense>
            }
          ></Route>
        </Route>
      </>
    )
  );

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

function StandAloneReturnPortal() {

  return <ReturnPortal />;
}

function Layout() {
  const [configLoaded, setConfigLoaded] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [AppBridgeComponents, setAppBridgeComponents] = React.useState(null);

  React.useEffect(() => {
    const loadAppBridge = async () => {
      try {
        // Dynamically import app-bridge dependencies
        const [{ AppType, Provider: GadgetProvider, useGadget }, { NavMenu }] =
          await Promise.all([
            import("@gadgetinc/react-shopify-app-bridge"),
            import("@shopify/app-bridge-react"),
          ]);

        // Wait for gadgetConfig to be available
        let attempts = 0;
        while (!window.gadgetConfig && attempts < 100) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          attempts++;
        }

        if (!window.gadgetConfig) {
          throw new Error("Gadget configuration failed to load");
        }

        setAppBridgeComponents({
          AppType,
          GadgetProvider,
          useGadget,
        });
        setConfigLoaded(true);
      } catch (err) {
        console.error("Failed to load configuration:", err);
        setError(err.message);
      }
    };

    loadAppBridge();
  }, []);

  if (error) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <Text variant="headingMd" as="h2">
          Configuration Error
        </Text>
        <Text as="p">{error}</Text>
      </div>
    );
  }

  if (!configLoaded || !AppBridgeComponents) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Spinner accessibilityLabel="Loading configuration" size="large" />
      </div>
    );
  }

  const { AppType, GadgetProvider } = AppBridgeComponents;

  return (
    <GadgetProvider
      type={AppType.Embedded}
      shopifyApiKey={window.gadgetConfig.apiKeys.shopify}
      api={getApi()}
    >
      <AuthenticatedApp AppBridgeComponents={AppBridgeComponents} />
    </GadgetProvider>
  );
}

function AuthenticatedApp({ AppBridgeComponents }) {
  // console.log(AppBridgeComponents)
  const { useGadget } = AppBridgeComponents;
  const { isAuthenticated, loading } = useGadget();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
        }}
      >
        <Spinner accessibilityLabel="Spinner example" size="large" />
      </div>
    );
  }
  return isAuthenticated ? (
    <EmbeddedApp AppBridgeComponents={AppBridgeComponents} />
  ) : (
    <UnauthenticatedApp />
  );
}

function EmbeddedApp({ AppBridgeComponents }) {
  // console.log(typeof NavMenu)

  return (
    <>
      <NavMenu>
        <a href="/dashboard">Dashboard</a>
        <a href="/return-rule-editor">Return rule editor</a>
        <a href="/workflow-builder">Workflow builder</a>
        <a href="/integrations">Integrations</a>
      </NavMenu>
      <Outlet />
    </>
  );
}

function UnauthenticatedApp() {
  return (
    <Page>
      <div style={{ height: "80px" }}>
        <Card padding="500">
          <Text variant="headingLg" as="h1">
            App must be viewed in the Shopify Admin
          </Text>
          <Box paddingBlockStart="200">
            <Text variant="bodyLg" as="p">
              Edit this page:{" "}
              <a
                href={`/edit/${process.env.GADGET_PUBLIC_APP_ENV}/files/web/components/App.jsx`}
              >
                web/components/App.jsx
              </a>
            </Text>
          </Box>
        </Card>
      </div>
    </Page>
  );
}

export default App;
