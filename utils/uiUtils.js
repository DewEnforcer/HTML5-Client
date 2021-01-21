function handleLogoutRequest() {
  if (HERO.isLogout) {
    return;
  }
  sendPacket([REQUEST_LOGOUT, 0]);
}
function requestPortalJump() {
  if (HERO.isJumping) return;
  let portalID = null;
  portalID = getNearestPortal();
  if (portalID === null) return; //dont bother sending the command - no portals
  SOCKET.sendPacket([REQUEST_PORTAL_JUMP, getNearestPortal()]);
}
