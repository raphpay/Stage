import React from 'react';
import {Image, ImageSourcePropType, StyleSheet, Text, View} from 'react-native';
import IconButton from './IconButton';

interface VideoProps {
  title: string;
  source: ImageSourcePropType;
  action: () => void;
}

function Video(props: VideoProps): React.JSX.Element {
  const {title, source, action} = props;

  return (
    <View style={styles.video}>
      <Image source={source} style={styles.miniature} />
      <View style={styles.info}>
        <View style={styles.title}>
          <Image
            source={require('../../assets/images/scr.jpeg')}
            style={styles.logo}
          />
          <Text>{title}</Text>
        </View>
        <IconButton
          source={require('../../assets/images/point.png')}
          action={action}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  icon: {width: 35, height: 35},
  video: {
    width: '100%',
    height: 300,
    alignItems: 'center',
  },

  miniature: {width: '100%', height: 200, resizeMode: 'contain'},
  logo: {width: 40, height: 40, borderRadius: 40},
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    justifyContent: 'space-between',
    width: '100%',
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default Video;
