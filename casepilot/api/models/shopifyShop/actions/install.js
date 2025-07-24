import { applyParams, save, ActionOptions } from "gadget-server";

/** @type { ActionRun } */
export const run = async ({ params, record, logger, api, connections }) => {
  applyParams(params, record);
  await save(record);
};

/** @type { ActionOnSuccess } */
export const onSuccess = async ({ params, record, logger, api, connections }) => {
  try {
    logger.info({ shopId: record.id, domain: record.domain }, "Starting initial sync for newly installed shop");
    
    // Trigger a complete sync of all Shopify data for the newly installed shop
    await api.shopifySync.run({
      shop: { _link: record.id },
      domain: record.domain,
      force: true, // Force a complete sync
      models: null // Sync all enabled models
    });
    
    logger.info({ shopId: record.id, domain: record.domain }, "Initial sync successfully started for newly installed shop");
  } catch (error) {
    logger.error({ 
      shopId: record.id, 
      domain: record.domain, 
      error: error.message 
    }, "Failed to start initial sync for newly installed shop");
    
    // Don't throw the error to avoid failing the installation process
    // The sync can be retried later if needed
  }
};

/** @type { ActionOptions } */
export const options = { actionType: "create" };
