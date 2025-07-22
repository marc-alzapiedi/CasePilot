import { useState, useEffect } from "react";
import { AutoTable } from "@gadgetinc/react/auto/polaris";
import {
  Box,
  Card,
  Layout,
  Page,
  Tabs,
  Frame,
} from "@shopify/polaris";
import { getApi } from "../api";



const IndexPage = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const tabs = [
    {
      id: "case-console",
      content: "Case Console",
      panelID: "case-console-panel",
    },
    {
      id: "dashboard",
      content: "Dashboard",
      panelID: "dashboard-panel",
    },
    {
      id: "return-rule-editor",
      content: "Return Rule Editor",
      panelID: "return-rule-editor-panel",
    },
    {
      id: "workflow-builder",
      content: "Workflow Builder",
      panelID: "workflow-builder-panel",
    },
    {
      id: "integrations",
      content: "Integrations",
      panelID: "integrations-panel",
    },
  ];

  const renderTabContent = () => {
    switch (selectedTab) {
      case 0:
        return <div>Case Console Content</div>;
      case 1:
        return <div>Dashboard Content</div>;
      case 2:
        return <div>Return Rule Editor Content</div>;
      case 3:
        return <div>Workflow Builder Content</div>;
      case 4:
        return <div>Integrations Content</div>;
      default:
        return <div>Welcome to CasePilot</div>;
    }
  };



  return (
      <Page fullWidth>
        <Layout>
          <Layout.Section>
            <Card>
              <Tabs
                tabs={tabs}
                selected={selectedTab}
                onSelect={setSelectedTab}
                fitted
              />
              <Box padding="400">{renderTabContent()}</Box>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
  );
};

export default IndexPage;