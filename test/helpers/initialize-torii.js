import initializeTorii from 'torii/initializers/initialize-torii';
import initializeToriiCallback from 'torii/initializers/initialize-torii-callback';
import initializeToriiSession from 'torii/initializers/initialize-torii-session';
import initializeToriiRouting from 'torii/initializers/initialize-torii-routing';

export default function(Application){
  Application.initializer( initializeToriiCallback );
  Application.initializer( initializeTorii );
  Application.initializer( initializeToriiSession );
  Application.initializer( initializeToriiRouting );
}
