import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "returnRequest" model, go to https://casepilot.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "e3jKCFiiBg2J",
  fields: {
    customerName: {
      type: "string",
      validations: { required: true },
      storageKey: "bOYKy9Pzw4o3::w_NKCFWuq_Ka",
    },
    order: {
      type: "belongsTo",
      parent: { model: "shopifyOrder" },
      storageKey: "VsmT704hyJHS::Wm0r-sW8q4zj",
    },
    product: {
      type: "string",
      validations: { required: true },
      storageKey: "vq3xNrj6WxJG::gNTPWh3u17YF",
    },
    reason: {
      type: "string",
      validations: { required: true },
      storageKey: "o4wcVIbGiDg5::eVCx9gBDmcim",
    },
    shop: {
      type: "belongsTo",
      parent: { model: "shopifyShop" },
      storageKey: "e3jKCFiiBg2J-BelongsTo-Shop",
    },
    status: {
      type: "enum",
      acceptMultipleSelections: false,
      acceptUnlistedOptions: false,
      options: ["pending", "approved", "rejected"],
      validations: { required: true },
      storageKey: "0dLyU_SVBghP::L-2Fjj-0MX5h",
    },
  },
};
