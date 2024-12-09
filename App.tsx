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
      <View style={styles.view}>
        <Image
          style={styles.image}
          source={require('./src/assets/images/youtube.png')}
        />

        <View style={styles.buttonContainer}>
          <Button title="A" />
          <Button title="B" />
          <Button title="C" />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  view: {
    backgroundColor: 'red',
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
    backgroundColor: 'blue',
  },
});

export default App;
