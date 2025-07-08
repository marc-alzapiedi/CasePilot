import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "refund" model, go to https://casepilot.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "2vtXaEE2iIB6",
  fields: {
    amount: {
      type: "number",
      validations: { required: true },
      storageKey: "Uv_8d8NITks2::3Fc3e68LLZuC",
    },
    method: {
      type: "string",
      validations: { required: true },
      storageKey: "R8AjuuVkdDBx::x6Feyflrhp6k",
    },
    order: {
      type: "belongsTo",
      parent: { model: "shopifyOrder" },
      storageKey: "53pM3gM74Mjp::MVnpKyPwS-_m",
    },
    returnRequest: {
      type: "belongsTo",
      parent: { model: "returnRequest" },
      storageKey: "Mx91cX87EMJ3::tVSFV52vlPV7",
    },
    shop: {
      type: "belongsTo",
      parent: { model: "shopifyShop" },
      storageKey: "2vtXaEE2iIB6-BelongsTo-Shop",
    },
    status: {
      type: "enum",
      acceptMultipleSelections: false,
      acceptUnlistedOptions: false,
      options: ["pending", "issued", "failed"],
      validations: { required: true },
      storageKey: "Qc6tZoihE1P0::TuzfW6sM8G8J",
    },
  },
};
