var Router = Ember.Router;
var proto = Ember.RouterDSL.prototype;

var currentMap = null;

proto.authenticatedRoute = function() {
  this.route.apply(this, arguments);
  currentMap.push(arguments[0]);
};

Router.reopen({
  _initRouterJs: function() {
    currentMap = [];
    this._super();
    this.router.authenticatedRoutes = currentMap;
  }
});
