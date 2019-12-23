import { update, get } from '@reshuffle/db';

/* @expose */
export async function getRemoteOrnaments() {
  return await get('temp');
}

/* @expose */
export async function saveRemoteOrnaments(ornaments) {
  return await update('temp', (oldOrnaments) => ornaments);
}
