/**
 * Checks whether adding a dependency creates a cycle.
 *
 * @param {string} movieId - Movie being updated
 * @param {string[]} prerequisites - Proposed prerequisite movie IDs
 * @param {Map<string, string[]>} graph - Existing dependency graph
 * @returns {boolean}
 */
export const wouldCreateCycle = (movieId, prerequisites, graph) => {
  const visited = new Set();

  const dfs = (currentId) => {
    // We reached the movie being updated again
    if (currentId === movieId) {
      return true;
    }

    // Already explored this node
    if (visited.has(currentId)) {
      return false;
    }

    visited.add(currentId);

    const dependencies = graph.get(currentId) || [];

    for (const dependencyId of dependencies) {
      if (dfs(dependencyId)) {
        return true;
      }
    }

    return false;
  };

  for (const prerequisiteId of prerequisites) {
    if (dfs(prerequisiteId)) {
      return true;
    }
  }

  return false;
};

export const getRewatchOrder = (movieId, graph) => {
  const visited = new Set();
  const result = [];

  const dfs = (currentId) => {
    if (visited.has(currentId)) {
      return;
    }

    visited.add(currentId);

    const dependencies = graph.get(currentId) || [];

    for (const dependencyId of dependencies) {
      dfs(dependencyId);
    }

    result.push(currentId);
  };

  const prerequisites = graph.get(movieId) || [];

  for (const prerequisiteId of prerequisites) {
    dfs(prerequisiteId);
  }

  return result;
};
