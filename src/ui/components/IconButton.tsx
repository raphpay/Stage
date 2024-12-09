import React from 'react';
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

interface IconProps {
  source: ImageSourcePropType;
  action: () => void;
}

function IconButton(props: IconProps): React.JSX.Element {
  const {source, action} = props;

  return (
    <TouchableOpacity onPress={action}>
      <Image source={source} style={styles.icon} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  icon: {width: 35, height: 35},
});

export default IconButton;
