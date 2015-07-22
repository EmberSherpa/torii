import startApp from 'test/helpers/start-app';
import configuration from 'torii/configuration';
import AuthenticatedRouteMixin from 'torii/routing/authenticated-route-mixin';
import authenticatedRoute from 'torii/routing';

var app, container, originalSessionServiceName, originalSessionProvider;

module('Routing - Acceptance', {
  setup: function(){
    originalSessionServiceName = configuration.sessionServiceName;
    delete configuration.sessionServiceName;
    originalSessionProvider = configuration.sessionProvider;
    delete configuration.sessionProvider;
  },

  teardown: function(){
    Ember.run(app, 'destroy');
    configuration.sessionServiceName = originalSessionServiceName;
    configuration.sessionProvider = originalSessionProvider;
  }
});

test('route mixin is not injected by default', function(assert){
  app = startApp({loadInitializers: true});
  container = app.__container__;

  container.register('route:application', Ember.Route.extend());
  var applicationRoute = container.lookup('route:application');

  var isMixinAdded = AuthenticatedRouteMixin.detect(applicationRoute);
  assert.ok(!isMixinAdded,
    'authenticated route mixin was not mixed into to Route class');
});

test('route mixin is injected when sessionServiceName is set', function(assert){
  configuration.sessionServiceName = 'session';

  app = startApp({loadInitializers: true});
  container = app.__container__;

  container.register('route:application', Ember.Route.extend());
  var applicationRoute = container.lookup('route:application');

  var isMixinAdded = AuthenticatedRouteMixin.detect(applicationRoute);
  assert.ok(isMixinAdded,
    'authenticated route mixin was mixed into to Route class');
});

test('checkLogin is not called in absense of authenticated routes', function(assert){
  assert.expect(1);
  configuration.sessionServiceName = 'session';

  app = startApp({loadInitializers: true});
  container = app.__container__;

  var called = false;
  container.register('route:application', Ember.Route.extend({
    checkLogin: function() {
      called = true;
    }
  }));

  var applicationRoute = container.lookup('route:application');
  applicationRoute.beforeModel();
  assert.ok(!called, 'checkLogin was not called');

});

test('checkLogin is called when an authenticated route is present', function(assert){
  assert.expect(2);
  configuration.sessionServiceName = 'session';

  var routesConfigured = false;
  var Router = Ember.Router.extend();
  Router.map(function(){
    routesConfigured = true;
    authenticatedRoute(this, 'account');
  });

  app = startApp({
    loadInitializers: true,
    Router: Router
  });
  container = app.__container__;

  var called = false;
  container.register('route:application', Ember.Route.extend({
    checkLogin: function() {
      called = true;
    }
  }));

  var applicationRoute = container.lookup('route:application');

  Ember.run(function(){
    app.advanceReadiness();
  });

  return app.boot().then(function(){
    applicationRoute.beforeModel();
    assert.ok(routesConfigured, 'Router map was called');
    assert.ok(called, 'checkLogin was called');
  });
});
