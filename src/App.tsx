import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { MantineProvider } from '@mantine/core';
import Home from './pages/Home';
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@fontsource/manrope/400.css';
import '@fontsource/manrope/500.css';
import '@fontsource/manrope/600.css';
import '@fontsource/manrope/700.css';
import './theme/variables.css';
import './theme/utilities.css';

setupIonicReact();

const App: React.FC = () => (
  <MantineProvider
    defaultColorScheme="light"
    theme={{
      primaryColor: 'brand',
      colors: {
        brand: [
          '#edf7ff',
          '#d9eeff',
          '#b3ddff',
          '#82c7ff',
          '#53b2ff',
          '#2f9eff',
          '#1a7dd8',
          '#1061a8',
          '#0a4679',
          '#062c4c',
        ],
      },
      fontFamily: 'Manrope, Segoe UI, sans-serif',
      defaultRadius: 'md',
      radius: {
        md: '12px',
        lg: '18px',
      },
      shadows: {
        md: '0 10px 22px rgba(8, 47, 73, 0.12)',
      },
    }}
  >
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/home">
            <Home />
          </Route>
          <Route exact path="/">
            <Redirect to="/home" />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  </MantineProvider>
);

export default App;
