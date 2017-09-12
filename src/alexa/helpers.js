
// Updates an intent to remove the value of a slot
// To clear
function clearSlotValueFromIntent({ intent, slotName }) {
  const { slots } = intent;

  for (const i of Object.keys(slots)) {
    const slot = slots[i];
    if (slot.name === slotName) {
      delete slot.value;
      delete slot.resolutions;
    }
  }
}

function getSlotValue({ intent, slotName, resolveSlot = x => x }) {
  const { slots } = intent;

  const slot = Object.keys(slots)
    .map(x => slots[x])
    .filter(x => x.name === slotName)[0];

  if (slot === undefined) {
    throw new Error(`No such slot in intent: ${slotName}`);
  }

  let slotValue = null;

  // Assume that if there are `resolutions`, it is a custom type that is a enum
  if (slot.resolutions && slot.resolutions.resolutionsPerAuthority) {
    const { resolutionsPerAuthority } = slot.resolutions;

    const matchingIds = resolutionsPerAuthority
      .filter(x => x.status.code === 'ER_SUCCESS_MATCH')
      .map(x => x.values)
      .reduce((acc, x) => [...acc, ...x], [])
      .map(x => x.value.id);

    // At least one match, take the id
    if (matchingIds.length > 0) {
      slotValue = matchingIds[0];
    }
  } else if (slot.value !== undefined) {
    // Without `resolutions`, it could be optional or in-built type
    slotValue = slot.value;
  }

  slotValue = resolveSlot(slotValue);

  return slotValue;
}

export {
  getSlotValue,
  clearSlotValueFromIntent,
};
