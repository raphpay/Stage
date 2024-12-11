import React from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import IconButton from './src/ui/components/IconButton';
import Video from './src/ui/components/Video';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const categories = [
    'All',
    'New to you',
    'Apple',
    'Gaming',
    'Video',
    'Music',
    'Trending',
    'Tech',
    'News',
    'Sports',
    'Comedy',
    'Movies',
    'Health',
    'Food',
    'Fashion',
  ];

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
  function safari() {
    console.log('safari');
  }
  function video1() {
    console.log('video1');
  }

  function video2() {
    console.log('video2');
  }

  function video3() {
    console.log('video3');
  }
  return (
    <SafeAreaView style={styles.backgroundStyle}>
      {/* top barre */}
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
      {/* ScrollView horizontal pour les catégories */}
      <ScrollView
        contentContainerStyle={styles.textview}
        horizontal
        showsHorizontalScrollIndicator={false} // Cache la barre de défilement horizontale
      >
        <IconButton
          source={require('./src/assets/images/safari.png')}
          action={safari}
        />

        {/* Catégories dynamiquement générées */}
        {categories.map((category, index) => (
          <Text key={index} style={styles.category}>
            {category}
          </Text>
        ))}
      </ScrollView>

      <ScrollView>
        <Video
          title={'video1'}
          source={require('./src/assets/images/miniature-1.jpeg')}
          action={video1}
        />
        <Video
          title={'video2'}
          source={require('./src/assets/images/miniature-2.jpeg')}
          action={video2}
        />
        <Video
          title={'video3'}
          source={require('./src/assets/images/miniature-3.jpeg')}
          action={video3}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backgroundStyle: {
    flex: 1,
    backgroundColor: '#fff', // Assure-toi d'avoir un fond blanc
  },
  view: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Ajouter un alignement vertical
    paddingHorizontal: 10,
  },
  image: {
    width: 100,
    height: 50,
    resizeMode: 'contain',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '60%', // Ajuste la largeur du conteneur pour plus de contrôle
  },
  icon: {
    width: 35,
    height: 35,
  },
  textview: {
    backgroundColor: '#f5f5f5', // Couleur de fond plus douce
    width: '100%',
    height: 50,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'flex-start', // Change à 'flex-start' pour éviter un trop grand espacement entre les éléments
    alignItems: 'center',
    paddingHorizontal: 10, // Ajoute un peu de padding pour un meilleur espacement
  },
  category: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 20, // Espacement entre les catégories
  },
});

export default App;
