/** @type { ActionRun } */
export const run = async ({ params, logger, api, connections }) => {
  logger.info("Starting session debug action");

  try {
    // Fetch all session records with shop relationship
    const sessions = await api.session.findMany({
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        shopId: true,
        shopifySID: true,
        shop: {
          id: true,
          name: true,
          domain: true,
          myshopifyDomain: true
        }
      }
    });

    logger.info(`Found ${sessions.length} total session records`);

    // Log overall session statistics
    const sessionsWithShopId = sessions.filter(s => s.shopId);
    const sessionsWithoutShopId = sessions.filter(s => !s.shopId);
    const sessionsWithShopRelation = sessions.filter(s => s.shop);

    logger.info("Session Statistics", {
      total: sessions.length,
      withShopId: sessionsWithShopId.length,
      withoutShopId: sessionsWithoutShopId.length,
      withShopRelation: sessionsWithShopRelation.length
    });

    // Log current shop context
    const currentShopId = connections.shopify.currentShopId;
    logger.info("Current shop context", { currentShopId });

    // Log detailed information about each session
    sessions.forEach((session, index) => {
      logger.info(`Session ${index + 1}`, {
        id: session.id,
        createdAt: session.createdAt,
        shopId: session.shopId,
        shopifySID: session.shopifySID,
        hasShopRelation: !!session.shop,
        shopDetails: session.shop ? {
          id: session.shop.id,
          name: session.shop.name,
          domain: session.shop.domain,
          myshopifyDomain: session.shop.myshopifyDomain
        } : null
      });
    });

    // Highlight problematic sessions
    if (sessionsWithoutShopId.length > 0) {
      logger.warn(`Found ${sessionsWithoutShopId.length} sessions without shopId`, {
        sessionIds: sessionsWithoutShopId.map(s => s.id)
      });
    }

    // Check for sessions with shopId but no shop relation
    const orphanedSessions = sessions.filter(s => s.shopId && !s.shop);
    if (orphanedSessions.length > 0) {
      logger.warn(`Found ${orphanedSessions.length} sessions with shopId but no shop relation`, {
        orphanedSessions: orphanedSessions.map(s => ({
          id: s.id,
          shopId: s.shopId
        }))
      });
    }

    // Return summary for API response
    return {
      totalSessions: sessions.length,
      sessionsWithShopId: sessionsWithShopId.length,
      sessionsWithoutShopId: sessionsWithoutShopId.length,
      sessionsWithShopRelation: sessionsWithShopRelation.length,
      orphanedSessions: orphanedSessions.length,
      currentShopId,
      sessions: sessions.map(s => ({
        id: s.id,
        shopId: s.shopId,
        hasShop: !!s.shop,
        shopName: s.shop?.name
      }))
    };

  } catch (error) {
    logger.error("Error in session debug action", { error: error.message });
    throw error;
  }
};
