import React from 'react';
import {
  Button,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  function ditBonjour() {
    console.log('Bonjour');
  }

  return (
    <SafeAreaView style={backgroundStyle}>
      <Text>Hello</Text>
      <Button title="Press me" onPress={ditBonjour} />
      <View style={styles.view}></View>
      <Image
        style={styles.image}
        source={require('./src/assets/images/youtube.png')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  view: {
    backgroundColor: 'red',
    width: 1000,
    height: 50,
  },
  image: {
    width: 100,
    resizeMode: 'contain',
    height: 100,
  },
});

export default App;
