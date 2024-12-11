import React, {useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// Application principale avec la navigation
const App = () => {
  const [pokemonList, setPokemonList] = useState([]); // Liste des Pokémon
  const [loading, setLoading] = useState(false); // État de chargement
  const [selectedPokemon, setSelectedPokemon] = useState(null); // Pokémon sélectionné avec ses détails
  const [combatants, setCombatants] = useState([]); // Pokémon choisis pour le combat
  const [combatResult, setCombatResult] = useState(null); // Résultat du combat

  // Fonction pour récupérer le nom en français d'un Pokémon à partir de son URL
  const getPokemonNameInFrench = async url => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      const speciesUrl = data.species.url;

      // Récupérer les traductions disponibles
      const speciesResponse = await fetch(speciesUrl);
      const speciesData = await speciesResponse.json();

      // Trouver le nom en français
      const frenchName = speciesData.names.find(
        name => name.language.name === 'fr',
      );

      // Retourner le nom en français ou en anglais si non trouvé
      return frenchName ? frenchName.name : data.name;
    } catch (error) {
      console.error(
        'Erreur lors de la récupération du nom en français :',
        error,
      );
      return null;
    }
  };

  // Fonction pour récupérer tous les Pokémon depuis l'API
  const fetchPokemon = async () => {
    setLoading(true); // On active le chargement

    try {
      const response = await fetch(
        'https://pokeapi.co/api/v2/pokemon?limit=20', // Appel à l'API pour récupérer 20 Pokémon
      );
      const data = await response.json(); // Conversion des données en JSON

      // Récupérer l'image et le nom en français pour chaque Pokémon
      const updatedPokemonList = await Promise.all(
        data.results.map(async pokemon => {
          const pokemonResponse = await fetch(pokemon.url);
          const pokemonData = await pokemonResponse.json();
          const frenchName = await getPokemonNameInFrench(pokemon.url);
          return {
            ...pokemon,
            image: pokemonData.sprites.front_default, // Récupère l'image du Pokémon
            name: frenchName || pokemon.name, // Utilise le nom en français ou en anglais
            stats: pokemonData.stats, // Ajoute les stats du Pokémon
            height: pokemonData.height,
            weight: pokemonData.weight,
            types: pokemonData.types,
          };
        }),
      );

      setPokemonList(updatedPokemonList); // Mise à jour de l'état avec la liste des Pokémon
    } catch (error) {
      console.error('Erreur de récupération des Pokémon :', error);
    } finally {
      setLoading(false); // On désactive le chargement
    }
  };

  // Fonction pour récupérer les détails d'un Pokémon
  const fetchPokemonDetails = async name => {
    setLoading(true); // On active le chargement des détails du Pokémon

    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${name}`, // URL pour récupérer les détails d'un Pokémon
      );
      const data = await response.json(); // Conversion des données en JSON
      setSelectedPokemon(data); // Mettre à jour l'état avec les informations détaillées du Pokémon
    } catch (error) {
      console.error('Erreur de récupération des détails du Pokémon :', error);
    } finally {
      setLoading(false); // On désactive le chargement
    }
  };

  // Fonction pour commencer un combat entre deux Pokémon
  const startCombat = () => {
    const [pokemon1, pokemon2] = combatants;

    // Calcul de la puissance des Pokémon (simple exemple avec attaque et défense)
    const power1 = pokemon1.stats[4].base_stat + pokemon1.stats[1].base_stat; // Attaque + Défense
    const power2 = pokemon2.stats[4].base_stat + pokemon2.stats[1].base_stat; // Attaque + Défense

    // Déterminer le gagnant
    if (power1 > power2) {
      setCombatResult(`${pokemon1.name} gagne le combat!`);
    } else if (power2 > power1) {
      setCombatResult(`${pokemon2.name} gagne le combat!`);
    } else {
      setCombatResult("C'est un match nul !");
    }
  };

  // Fonction pour ajouter un Pokémon aux combattants
  const selectCombatant = pokemon => {
    if (combatants.length < 2) {
      setCombatants(prev => [...prev, pokemon]);
    }
  };

  // Fonction pour convertir les hectogrammes en kilogrammes
  const convertToKg = hectograms => {
    return (hectograms / 10).toFixed(2); // 1 hectogramme = 0.1 kilogramme
  };

  // Fonction pour convertir les décimètres en mètres
  const convertToMeters = decimeters => {
    return (decimeters / 10).toFixed(2); // 1 décimètre = 0.1 mètre
  };

  // Rendu des Pokémon dans une liste avec image à côté du nom
  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.pokemonItem}
      onPress={() => selectCombatant(item)} // Ajouter le Pokémon aux combattants
    >
      <Image source={{uri: item.image}} style={styles.pokemonImage} />
      <Text style={styles.pokemonText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={fetchPokemon}>
        <Text style={styles.buttonText}>Récupérer tous les Pokémon</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : selectedPokemon ? (
        // Afficher les détails du Pokémon sélectionné
        <View style={styles.pokemonDetailsContainer}>
          <Text style={styles.pokemonDetailsTitle}>
            Détails de {selectedPokemon.name}
          </Text>
          <Image
            source={{uri: selectedPokemon.sprites.front_default}}
            style={styles.pokemonImage}
          />
          <Text style={styles.pokemonText}>Types :</Text>
          <Text style={styles.pokemonText}>
            {selectedPokemon.types.map(type => type.type.name).join(', ')}
          </Text>
          <Text style={styles.pokemonText}>
            Poids : {convertToKg(selectedPokemon.weight)} kg
          </Text>
          <Text style={styles.pokemonText}>
            Taille : {convertToMeters(selectedPokemon.height)} m
          </Text>
          <Text style={styles.pokemonText}>Stats :</Text>
          {selectedPokemon.stats.map(stat => (
            <Text key={stat.stat.name} style={styles.pokemonText}>
              {stat.stat.name} : {stat.base_stat}
            </Text>
          ))}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedPokemon(null)} // Revenir à la liste des Pokémon
          >
            <Text style={styles.buttonText}>Retour à la liste</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // Affichage de la liste des Pokémon avec image
        <FlatList
          data={pokemonList}
          renderItem={renderItem}
          keyExtractor={item => item.url} // Utilise l'URL comme clé unique
          style={styles.pokemonList}
        />
      )}

      {combatants.length === 2 && (
        <View style={styles.combatContainer}>
          <Text style={styles.combatText}>
            Combat entre {combatants[0].name} et {combatants[1].name}
          </Text>
          <TouchableOpacity style={styles.button} onPress={startCombat}>
            <Text style={styles.buttonText}>Démarrer le combat</Text>
          </TouchableOpacity>
        </View>
      )}

      {combatResult && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>{combatResult}</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setCombatants([]); // Réinitialiser les combattants
              setCombatResult(null); // Réinitialiser le résultat
            }}>
            <Text style={styles.buttonText}>Rejouer</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
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
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pokemonList: {
    marginTop: 20,
    width: '100%',
  },
  pokemonItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pokemonImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  pokemonText: {
    fontSize: 18,
    color: '#333',
  },
  pokemonDetailsContainer: {
    alignItems: 'center',
    paddingTop: 20,
  },
  pokemonDetailsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  backButton: {
    backgroundColor: '#FF5733',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  combatContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  combatText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resultContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'green',
  },
});

export default App;
