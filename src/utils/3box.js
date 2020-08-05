import { Libp2pCryptoIdentity } from '@textile/threads-core';
const Box = require('3box');

export async function get3BoxIdentity() {
  /**
   * Initialize the 3Box API uses Metamask
   * This will allow the user to sign their transactions
   * Using Metamask and 3Box directly
   */
  const box = await Box.create(window.ethereum);
  const [address] = await window.ethereum.enable();
  await box.auth([], { address });
  // Note: sometimes, openSpace returns early... caution
  const space = await box.openSpace('io-textile-dropzone');
  await box.syncDone;
  try {
    // We'll try to restore the private key if it's available
    var storedIdent = await space.private.get('identity');
    if (storedIdent === null) {
      throw new Error('No identity');
    }
    const identity = await Libp2pCryptoIdentity.fromString(storedIdent);
    return identity;
  } catch (e) {
    /**
     * If the stored identity wasn't found, create a new one.
     */
    const identity = await Libp2pCryptoIdentity.fromRandom();
    const identityString = identity.toString();
    await space.private.set('identity', identityString);
    return identity;
  }
}
