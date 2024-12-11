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
import CombatArena from './src/ui/components/AnimationCombat';

const App = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [combatants, setCombatants] = useState([]);
  const [combatResult, setCombatResult] = useState(null);

  const getPokemonNameInFrench = async url => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      const speciesResponse = await fetch(data.species.url);
      const speciesData = await speciesResponse.json();

      const frenchName = speciesData.names.find(
        name => name.language.name === 'fr',
      );

      return frenchName ? frenchName.name : data.name;
    } catch (error) {
      console.error(
        'Erreur lors de la récupération du nom en français :',
        error,
      );
      return null;
    }
  };

  const fetchPokemon = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        'https://pokeapi.co/api/v2/pokemon?limit=50',
      );
      const data = await response.json();

      const updatedPokemonList = await Promise.all(
        data.results.map(async pokemon => {
          try {
            const pokemonResponse = await fetch(pokemon.url);
            const pokemonData = await pokemonResponse.json();
            const frenchName = await getPokemonNameInFrench(pokemon.url);

            return {
              ...pokemon,
              image: pokemonData.sprites.front_default,
              name: frenchName || pokemon.name,
              stats: pokemonData.stats,
              height: pokemonData.height,
              weight: pokemonData.weight,
              types: pokemonData.types,
              id: pokemonData.id,
            };
          } catch (error) {
            console.error(
              'Erreur lors de la récupération des données du Pokémon :',
              error,
            );
            return null;
          }
        }),
      );

      setPokemonList(updatedPokemonList.filter(Boolean));
    } catch (error) {
      console.error('Erreur de récupération des Pokémon :', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPokemonDetails = async id => {
    setLoading(true);

    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const data = await response.json();
      setSelectedPokemon(data);
    } catch (error) {
      console.error('Erreur de récupération des détails du Pokémon :', error);
    } finally {
      setLoading(false);
    }
  };

  const typeAdvantages = {
    fire: {
      strongAgainst: ['grass', 'bug', 'ice', 'steel'],
      weakAgainst: ['water', 'rock', 'fire'],
    },
    water: {
      strongAgainst: ['fire', 'rock', 'ground'],
      weakAgainst: ['electric', 'grass'],
    },
    grass: {
      strongAgainst: ['water', 'rock', 'ground'],
      weakAgainst: ['fire', 'flying', 'bug', 'poison', 'ice'],
    },
    electric: {strongAgainst: ['water', 'flying'], weakAgainst: ['ground']},
    ground: {
      strongAgainst: ['electric', 'fire', 'rock', 'steel'],
      weakAgainst: ['water', 'ice', 'grass'],
    },
  };

  const calculateTypeModifier = (attackerTypes, defenderTypes) => {
    let attackBonus = 0;

    attackerTypes.forEach(attackerType => {
      const advantages = typeAdvantages[attackerType?.type?.name];
      if (!advantages) return;

      defenderTypes.forEach(defenderType => {
        const defenderTypeName = defenderType?.type?.name;
        if (advantages.strongAgainst.includes(defenderTypeName)) {
          attackBonus += 20; // Bonus de 20 points pour type fort
        }
      });
    });

    return attackBonus;
  };

  const startCombat = () => {
    if (combatants.length < 2) return;

    const [pokemon1, pokemon2] = combatants;

    const typeBonus1 = calculateTypeModifier(pokemon1.types, pokemon2.types);
    const typeBonus2 = calculateTypeModifier(pokemon2.types, pokemon1.types);

    const power1 =
      pokemon1.stats[4]?.base_stat + // Stat d'attaque spéciale
      pokemon1.stats[1]?.base_stat + // Stat d'attaque
      typeBonus1;

    const power2 =
      pokemon2.stats[4]?.base_stat + // Stat d'attaque spéciale
      pokemon2.stats[1]?.base_stat + // Stat d'attaque
      typeBonus2;

    if (power1 > power2) {
      setCombatResult(`${pokemon1.name} gagne le combat !`);
    } else if (power2 > power1) {
      setCombatResult(`${pokemon2.name} gagne le combat !`);
    } else {
      setCombatResult("C'est un match nul !");
    }
  };

  const selectCombatant = pokemon => {
    if (combatants.length < 2 && !combatants.includes(pokemon)) {
      setCombatants(prev => [...prev, pokemon]);
    }
  };

  const convertToKg = hectograms => (hectograms / 10).toFixed(2);

  const convertToMeters = decimeters => (decimeters / 10).toFixed(2);

  const renderItem = ({item}) => (
    <View style={styles.pokemonItem}>
      <TouchableOpacity
        onPress={() => selectCombatant(item)}
        style={styles.itemDetails}>
        <Image source={{uri: item.image}} style={styles.pokemonImage} />
        <Text style={styles.pokemonText}>{item.name}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.infoButton}
        onPress={() => fetchPokemonDetails(item.id)}>
        <Text style={styles.buttonText}>i</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={fetchPokemon}>
        <Text style={styles.buttonText}>Récupérer tous les Pokémon</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : selectedPokemon ? (
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
            onPress={() => setSelectedPokemon(null)}>
            <Text style={styles.buttonText}>Retour à la liste</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={pokemonList}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          style={styles.pokemonList}
        />
      )}

      {combatants.length === 2 && (
        <CombatArena
          pokemon1={combatants[0]}
          pokemon2={combatants[1]}
          combatResult={combatResult}
          startCombat={startCombat}
        />
      )}

      {combatResult && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>{combatResult}</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setCombatants([]);
              setCombatResult(null);
            }}>
            <Text style={styles.buttonText}>Rejouer</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

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
    justifyContent: 'space-between',
  },
  itemDetails: {
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
  infoButton: {
    backgroundColor: '#3498db',
    borderRadius: 50,
    padding: 10,
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
