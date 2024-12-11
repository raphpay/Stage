import React, {useEffect, useState} from 'react';
import {
  Animated,
  Dimensions,
  PanResponder,
  StyleSheet,
  Text,
  View,
} from 'react-native';

// Obtenir la largeur et la hauteur de l'écran
const {width, height} = Dimensions.get('window');

// Taille du joueur et des obstacles
const PLAYER_WIDTH = 40;
const PLAYER_HEIGHT = 40;
const OBSTACLE_WIDTH = 60;
const OBSTACLE_HEIGHT = 20;

export default function App() {
  const [playerPosition, setPlayerPosition] = useState(
    new Animated.Value(width / 2 - PLAYER_WIDTH / 2),
  ); // Position horizontale
  const [obstacles, setObstacles] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [obstacleSpeed, setObstacleSpeed] = useState(5); // Vitesse initiale des obstacles
  const [intervalSpeedIncrease] = useState(10000); // Temps pour augmenter la vitesse des obstacles (en ms)

  // Contrôles du joueur
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      if (!gameOver) {
        let newPos = gestureState.moveX - PLAYER_WIDTH / 2; // Position centrée sur le doigt
        if (newPos < 0) newPos = 0; // Limiter à gauche
        if (newPos > width - PLAYER_WIDTH) newPos = width - PLAYER_WIDTH; // Limiter à droite
        setPlayerPosition(new Animated.Value(newPos)); // Mettre à jour la position avec un nouvel Animated.Value
      }
    },
  });

  // Fonction pour créer un obstacle
  const createObstacle = () => {
    if (!gameOver) {
      const left = Math.random() * (width - OBSTACLE_WIDTH); // Position horizontale aléatoire
      const newObstacle = {
        left,
        top: -OBSTACLE_HEIGHT, // Commence hors de l'écran
        id: Date.now(),
      };
      setObstacles(prevObstacles => [...prevObstacles, newObstacle]); // Ajouter un obstacle
    }
  };

  // Fonction pour déplacer les obstacles
  const moveObstacles = () => {
    if (!gameOver) {
      setObstacles(prevObstacles => {
        return prevObstacles
          .map(obstacle => {
            const newTop = obstacle.top + obstacleSpeed; // Descendre l'obstacle
            if (newTop > height) {
              setScore(prevScore => prevScore + 1); // Augmenter le score quand l'obstacle touche le bas
              return null; // Supprimer l'obstacle une fois qu'il sort de l'écran
            }

            // Détection de collision
            if (
              newTop >= height - PLAYER_HEIGHT &&
              obstacle.left < playerPosition._value + PLAYER_WIDTH &&
              obstacle.left + OBSTACLE_WIDTH > playerPosition._value
            ) {
              setGameOver(true); // Fin du jeu en cas de collision
            }

            return {...obstacle, top: newTop}; // Mettre à jour la position de l'obstacle
          })
          .filter(Boolean); // Filtrer les obstacles qui sont hors de l'écran
      });
    }
  };

  // Mettre à jour les obstacles toutes les 30 ms
  useEffect(() => {
    if (!gameOver) {
      const intervalId = setInterval(moveObstacles, 30);
      return () => clearInterval(intervalId); // Nettoyage de l'intervalle
    }
  }, [obstacles, gameOver, obstacleSpeed]);

  // Créer des obstacles toutes les 2 secondes
  useEffect(() => {
    if (!gameOver) {
      const intervalId = setInterval(createObstacle, 2000);
      return () => clearInterval(intervalId); // Nettoyage du setInterval
    }
  }, [gameOver]);

  // Accélérer les obstacles toutes les x secondes
  useEffect(() => {
    if (!gameOver) {
      const speedInterval = setInterval(() => {
        setObstacleSpeed(prevSpeed => prevSpeed + 1); // Augmenter la vitesse des obstacles
      }, intervalSpeedIncrease); // Augmenter la vitesse toutes les 10 secondes

      return () => clearInterval(speedInterval); // Nettoyage de l'intervalle
    }
  }, [gameOver]);

  // Rendu des obstacles
  const renderObstacles = obstacles.map(obstacle => (
    <Animated.View
      key={obstacle.id}
      style={[
        styles.obstacle,
        {
          width: OBSTACLE_WIDTH,
          height: OBSTACLE_HEIGHT,
          left: obstacle.left,
          top: obstacle.top,
        },
      ]}
    />
  ));

  // Message de fin de jeu
  const renderGameOver = gameOver && (
    <View style={styles.gameOverContainer}>
      <Text style={styles.gameOverText}>Game Over!</Text>
      <Text style={styles.gameOverText}>Score Final: {score}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.score}>Score: {score}</Text>
      <Animated.View
        {...panResponder.panHandlers} // Permet de gérer le mouvement du joueur
        style={[styles.player, {left: playerPosition}]} // Applique la position animée
      />
      {renderObstacles}
      {renderGameOver}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  player: {
    position: 'absolute',
    bottom: 50,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
    backgroundColor: 'white',
  },
  obstacle: {
    position: 'absolute',
    backgroundColor: 'red',
  },
  score: {
    alignItems: 'flex-end',
    top: 400,
    left: 120,
    color: 'white',
    fontSize: 30,
  },
  gameOverContainer: {
    position: 'absolute',
    top: '40%',
    left: '10%',
    width: '80%',
    alignItems: 'center',
  },
  gameOverText: {
    color: 'white',
    fontSize: 24,
  },
});
