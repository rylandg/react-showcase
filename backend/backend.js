import { update, get, find, Q, remove } from '@reshuffle/db';

const treePrefix = 'tree_';

/* @expose */
export async function getRemoteOrnaments(id) {
  return await get(`${treePrefix}${id}`);
}

/* @expose */
export async function saveRemoteOrnaments(id, ornaments) {
  console.log(id);
  console.log(ornaments);
  return await update(`${treePrefix}${id}`, (oldOrnaments) => ornaments);
}

/* @expose */
export async function getAllTrees() {
  const allTrees = await find(Q.filter(Q.key.startsWith(treePrefix)));
  const treeKeys = allTrees.map(({ key }) => key);
  return treeKeys.map((key) => key.slice(treePrefix.length, key.length));
}

/* @expose */
export async function deleteTreeById(id) {
  return await remove(`${treePrefix}${id}`);
}
