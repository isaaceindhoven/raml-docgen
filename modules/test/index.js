module.exports = (function (params, request) {
  broadcastUser({data: 'pong'}, 'message', request);
});
