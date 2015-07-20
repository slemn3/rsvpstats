var VersionSetterMiddleware      = App.require("app/middleware/versionSetter")

module.exports = function(app) {
  // ROOT ROUTES
  app.all('/*', VersionSetterMiddleware())
  var TwitterController = App.require("app/controllers/twittercontroller")
  app.get('/', TwitterController.index)

}
