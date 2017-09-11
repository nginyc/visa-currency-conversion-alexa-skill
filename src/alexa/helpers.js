const getResolvedSlotsFromIntent = (intent) => {
  const slots = intent.slots;

  const resolvedSlots = {};

  Object.keys(slots)
    .forEach((i) => {
      const slot = slots[i];
      const slotName = slot.name;

      let slotValue = slot.value;

      if (slot.resolutions && slot.resolutions.resolutionsPerAuthority) {
        const resolutionsPerAuthority = slot.resolutions.resolutionsPerAuthority;

        const matchingIds = resolutionsPerAuthority
          .filter(x => x.status.code === 'ER_SUCCESS_MATCH')
          .map(x => x.values)
          .reduce((acc, x) => [...acc, ...x], [])
          .map(x => x.value.id);

        // Just the first match
        if (matchingIds.length > 0) {
          slotValue = matchingIds[0];
        }
      }

      resolvedSlots[slotName] = slotValue;
    });

  return resolvedSlots;
};

export {
  getResolvedSlotsFromIntent,
};
