import React from 'react';
import { FontAwesome, Entypo, FontAwesome5 } from '@expo/vector-icons';

import Colors from '../constants/Colors';

export default TabBarIcon = (props) => {
  return (
    <Entypo
      name={props.name}
      size={26}
      style={{ marginBottom: -3 }}
      color={props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
    />
  );
}

export const BackButtonIcon = props => {
  return (
    <FontAwesome
      name={props.name}
      size={26}
      color={ Colors.tabIconSelected }
    />
  );
}
