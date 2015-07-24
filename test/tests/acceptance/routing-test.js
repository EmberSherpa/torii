import startApp from 'test/helpers/start-app';
import configuration from 'torii/configuration';
import AuthenticatedRouteMixin from 'torii/routing/authenticated-route-mixin';

var app, originalSessionServiceName, originalSessionProvider;

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

test('ApplicationRoute#checkLogin is not called when no authenticated routes are present', function(assert){
  assert.expect(2);
  configuration.sessionServiceName = 'session';

  var routesConfigured = false;
  var checkLoginCalled = false;

  return bootApp({
    map: function() {
      routesConfigured = true;
    },
    container: function(container) {
      container.register('route:application', Ember.Route.extend());
    }
  }).then(function(){
    var applicationRoute = app.__container__.lookup('route:application');
    applicationRoute.reopen({
      checkLogin: function() {
        checkLoginCalled = true;
      }
    })
    applicationRoute.beforeModel();
    assert.ok(routesConfigured, 'Router map was called');
    assert.ok(!checkLoginCalled, 'checkLogin was not called');
  });
})

test('ApplicationRoute#checkLogin is called when an authenticated route is present', function(assert){
  assert.expect(2);
  configuration.sessionServiceName = 'session';

  var routesConfigured = false;
  var checkLoginCalled = false;

  return bootApp({
    map: function() {
      routesConfigured = true;
      this.authenticatedRoute('account');
    },
    container: function(container) {
      container.register('route:application', Ember.Route.extend());
      container.register('route:account', Ember.Route.extend());
    }
  }).then(function(){
    var applicationRoute = app.__container__.lookup('route:application');
    applicationRoute.reopen({
      checkLogin: function() {
        checkLoginCalled = true;
      }
    });
    applicationRoute.beforeModel();
    assert.ok(routesConfigured, 'Router map was called');
    assert.ok(checkLoginCalled, 'checkLogin was called');
  });
});

test('authenticated routes get authenticate method', function(assert){
  assert.expect(2);
  configuration.sessionServiceName = 'session';

  var checkLoginCalled = false;

  return bootApp({
    map: function() {
      this.route('home');
      this.authenticatedRoute('account');
    },
    container: function(container) {
      container.register('route:application', Ember.Route.extend());
      container.register('route:account', Ember.Route.extend());
      container.register('route:home', Ember.Route.extend());
    }
  }).then(function(){
    var authenticatedRoute = app.__container__.lookup('route:account');
    var unauthenticatedRoute = app.__container__.lookup('route:home');

    assert.ok(authenticatedRoute.authenticate, "authenticate function is present");
    assert.ok(!unauthenticatedRoute.authenticate, "authenticate function is not present");
  });
});

function bootApp(attrs) {
  var map = attrs.map || function(){};
  var containerSetup = attrs.container || function() {};

  var Router = Ember.Router.extend();

  Router.map(map);

  app = startApp({
    loadInitializers: true,
    Router: Router
  });

  containerSetup(app.__container__);

  Ember.run(function(){
    app.advanceReadiness();
  });

  return app.boot();
}
