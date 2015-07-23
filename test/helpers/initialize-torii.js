import initializeTorii from 'torii/initializers/initialize-torii';
import initializeToriiCallback from 'torii/initializers/initialize-torii-callback';
import initializeToriiSession from 'torii/initializers/initialize-torii-session';
import instanceInitializeToriiRoutes from 'torii/instance-initializers/setup-routes';

export default function(Application){
  Application.initializer( initializeToriiCallback );
  Application.initializer( initializeTorii );
  Application.initializer( initializeToriiSession );
  Application.instanceInitializer( instanceInitializeToriiRoutes );
}
