import React, {useEffect, useRef} from 'react';
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const CombatArena = ({pokemon1, pokemon2, combatResult, startCombat}) => {
  const pokemon1Position = useRef(new Animated.Value(0)).current;
  const pokemon2Position = useRef(new Animated.Value(0)).current;

  const animateAttack = () => {
    // Animation Pokémon 1 attaquant Pokémon 2
    Animated.sequence([
      Animated.timing(pokemon1Position, {
        toValue: -50, // Se rapproche
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(pokemon1Position, {
        toValue: 0, // Retour à la position initiale
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // Animation Pokémon 2 attaquant Pokémon 1
    Animated.sequence([
      Animated.timing(pokemon2Position, {
        toValue: 50, // Se rapproche
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(pokemon2Position, {
        toValue: 0, // Retour à la position initiale
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    if (pokemon1 && pokemon2) {
      animateAttack();
    }
  }, [pokemon1, pokemon2]);

  return (
    <View style={styles.arenaContainer}>
      <Text style={styles.title}>Arène de Combat</Text>
      <View style={styles.battleZone}>
        {/* Pokémon 1 */}
        <Animated.View
          style={[
            styles.pokemonContainer,
            {transform: [{translateX: pokemon1Position}]},
          ]}>
          <Image source={{uri: pokemon1.image}} style={styles.pokemonSprite} />
          <Text style={styles.pokemonName}>{pokemon1.name}</Text>
        </Animated.View>

        <Text style={styles.vsText}>VS</Text>

        {/* Pokémon 2 */}
        <Animated.View
          style={[
            styles.pokemonContainer,
            {transform: [{translateX: pokemon2Position}]},
          ]}>
          <Image source={{uri: pokemon2.image}} style={styles.pokemonSprite} />
          <Text style={styles.pokemonName}>{pokemon2.name}</Text>
        </Animated.View>
      </View>

      <TouchableOpacity style={styles.button} onPress={startCombat}>
        <Text style={styles.buttonText}>Lancer le Combat</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  arena: {
    flex: 1,
    justifyContent: 'center', // Centre verticalement
    alignItems: 'center', // Centre horizontalement
    padding: 20,
    backgroundColor: '#f0f0f0', // Couleur de fond pour l'arène
    zIndex: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  battleZone: {
    flexDirection: 'row', // Positionner les Pokémon côte à côte
    justifyContent: 'space-evenly', // Espace égal entre les Pokémon
    alignItems: 'center', // Alignement vertical centré
    width: '100%', // Occuper toute la largeur
    height: 200, // Hauteur fixe pour un bon centrage
    backgroundColor: '#ffffff', // Couleur de fond pour l'arène
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    padding: 10,
  },
  pokemonContainer: {
    alignItems: 'center',
    flex: 1, // Chaque Pokémon occupe un espace égal
  },
  pokemonSprite: {
    width: 100,
    height: 100,
  },
  pokemonName: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  result: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'green',
    marginVertical: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CombatArena;
