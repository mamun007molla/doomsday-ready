export const calculateBooking = (bundleSizes, groupSize) => {
  const dp = Array(groupSize + 1).fill(Infinity);
  const selectedBundle = Array(groupSize + 1).fill(null);

  // Zero tickets need zero bundles
  dp[0] = 0;

  // Calculate minimum bundles for every ticket amount
  for (let amount = 1; amount <= groupSize; amount++) {
    for (const bundleSize of bundleSizes) {
      if (bundleSize <= amount) {
        const previous = dp[amount - bundleSize];

        if (previous + 1 < dp[amount]) {
          dp[amount] = previous + 1;
          selectedBundle[amount] = bundleSize;
        }
      }
    }
  }

  // Exact booking is impossible
  if (dp[groupSize] === Infinity) {
    return {
      possible: false,
      minBundles: null,
      bundleCounts: {},
    };
  }

  // Reconstruct selected bundle quantities
  const bundleCounts = {};
  let remaining = groupSize;

  while (remaining > 0) {
    const bundleSize = selectedBundle[remaining];

    bundleCounts[bundleSize] = (bundleCounts[bundleSize] || 0) + 1;

    remaining -= bundleSize;
  }

  return {
    possible: true,
    minBundles: dp[groupSize],
    bundleCounts,
  };
};
