import startApp from 'test/helpers/start-app';
import configuration from 'torii/configuration';
import AuthenticatedRouteMixin from 'torii/routing/authenticated-route-mixin';

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
