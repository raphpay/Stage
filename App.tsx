import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React, {useState} from 'react';
import {Alert, Button, ScrollView, StyleSheet, Text, View} from 'react-native';

// Créer le Stack Navigator pour la navigation entre les écrans
const Stack = createStackNavigator();

// Écran principal du jeu (où l'histoire commence)
const GameScreen = ({navigation}) => {
  const [health, setHealth] = useState(100);
  const [inventory, setInventory] = useState([]);

  // Fonction pour afficher un message d'alerte lorsque la santé change
  const updateHealth = amount => {
    setHealth(prevHealth => {
      const newHealth = prevHealth + amount;
      if (newHealth <= 0) {
        Alert.alert('Vous êtes mort', 'Votre aventure a pris fin.');
        return 0;
      }
      return newHealth;
    });
  };

  // Fonction pour ajouter des objets à l'inventaire
  const addToInventory = item => {
    setInventory(prevInventory => [...prevInventory, item]);
  };

  // Scènes de l'histoire avec les choix
  const storyText = `
    Vous êtes un aventurier perdu dans une forêt mystérieuse. Vous entendez des bruits étranges venant des buissons.
    Votre santé actuelle est : ${health}%
    Votre inventaire : ${inventory.join(', ') || 'Vide'}
  `;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.storyText}>{storyText}</Text>
      <Text style={styles.storyText}>Vous avez 2 options :</Text>
      <Button
        title="Explorer les buissons"
        onPress={() => {
          updateHealth(-20); // Perd 20% de santé
          addToInventory('Clé magique'); // Ajoute un objet à l'inventaire
          navigation.navigate('ChoiceScreen', {
            health,
            inventory,
            story: 'Vous avez trouvé une clé magique !',
          });
        }}
      />
      <Button
        title="Fuir en courant"
        onPress={() => {
          updateHealth(-10); // Perd un peu de santé en fuyant
          navigation.navigate('ChoiceScreen', {
            health,
            inventory,
            story: 'Vous avez pris la fuite !',
          });
        }}
      />
    </ScrollView>
  );
};

// Écran de choix suivant après chaque décision
const ChoiceScreen = ({route, navigation}) => {
  const {health, inventory, story} = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.storyText}>{story}</Text>
      <Text style={styles.storyText}>Santé actuelle: {health}%</Text>
      <Text style={styles.storyText}>
        Inventaire: {inventory.join(', ') || 'Rien'}
      </Text>
      <Button
        title="Continuer l'aventure"
        onPress={() => {
          navigation.navigate('GameScreen'); // Retour à l'écran principal du jeu
        }}
      />
    </ScrollView>
  );
};

// Écran de fin du jeu
const EndScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.storyText}>Merci d'avoir joué !</Text>
    </View>
  );
};

// Application principale avec la navigation
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="GameScreen">
        <Stack.Screen
          name="GameScreen"
          component={GameScreen}
          options={{title: 'Aventure dans la forêt'}}
        />
        <Stack.Screen
          name="ChoiceScreen"
          component={ChoiceScreen}
          options={{title: "Choix de l'aventurier"}}
        />
        <Stack.Screen
          name="EndScreen"
          component={EndScreen}
          options={{title: 'Fin du jeu'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Styles du jeu
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  storyText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default App;
