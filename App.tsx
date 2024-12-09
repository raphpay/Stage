import React from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import IconButton from './src/ui/components/IconButton';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  function ditBonjour() {
    console.log('Bonjour');
  }

  function live() {
    console.log('live');
  }

  function notifications() {
    console.log('notifications');
  }

  function recherche() {
    console.log('recherche');
  }

  return (
    <SafeAreaView style={backgroundStyle}>
      <View style={styles.view}>
        <Image
          style={styles.image}
          source={require('./src/assets/images/youtube.png')}
        />

        <View style={styles.buttonContainer}>
          <IconButton
            source={require('./src/assets/images/live.png')}
            action={live}
          />
          <IconButton
            source={require('./src/assets/images/notifications.png')}
            action={notifications}
          />
          <IconButton
            source={require('./src/assets/images/recherche.png')}
            action={recherche}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  view: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  image: {
    width: 100,
    resizeMode: 'contain',
    height: 50,
  },
  button: {
    width: 100,
    height: 50,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  icon: {width: 35, height: 35},
});

export default App;
