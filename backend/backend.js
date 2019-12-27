import { update, get } from '@reshuffle/db';

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
