import initializeTorii from 'test/helpers/initialize-torii';

function startApp(attrs) {
  var App;
  if (!attrs) { attrs = {}; }

  var loadInitializers = attrs.loadInitializers;
  var Router = attrs.Router;

  var attributes = Ember.merge({
    // useful Test defaults
    rootElement: '#ember-testing',
    LOG_ACTIVE_GENERATION:false,
    LOG_VIEW_LOOKUPS: false
  }, attrs); // but you can override;

  var Application = Ember.Application.extend();

  (Router || Ember.Router.extend()).reopen({
    location: 'none'
  });

  Application.Router = Router;

  if (loadInitializers) {
    initializeTorii(Application);
  }

  Ember.run(function(){
    App = Application.create(attributes);
    App.setupForTesting();
    App.injectTestHelpers();
  });

  App.reset(); // this shouldn't be needed, i want to be able to "start an app at a specific URL"

  return App;
}

export default startApp;
