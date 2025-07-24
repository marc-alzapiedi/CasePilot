import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "shopifyLocation" model, go to https://casepilot.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "DataModel-Shopify-Location",
  fields: {},
  shopify: {
    fields: [
      "activatable",
      "active",
      "address1",
      "address2",
      "addressVerified",
      "city",
      "country",
      "countryCode",
      "deactivatable",
      "deactivatedAt",
      "deletable",
      "fulfillments",
      "fulfillsOnlineOrders",
      "hasActiveInventory",
      "hasUnfulfilledOrders",
      "inventoryItems",
      "inventoryQuantities",
      "legacy",
      "legacyResourceId",
      "localPickupSettingsV2",
      "name",
      "orders",
      "phone",
      "province",
      "provinceCode",
      "retailOrders",
      "shipsInventory",
      "shop",
      "shopifyCreatedAt",
      "shopifyUpdatedAt",
      "suggestedAddresses",
      "zipCode",
    ],
  },
};
