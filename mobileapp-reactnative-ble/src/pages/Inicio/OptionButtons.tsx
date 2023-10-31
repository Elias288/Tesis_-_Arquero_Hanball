import React from 'react';
import { Button } from 'react-native-paper';

import GlobalStyles from '../../utils/EstilosGlobales';

type optionButtonType = {
  text: string;
  icon: string;
  action?: () => void;
};

const OptionButtons = (props: optionButtonType) => {
  const { text, icon, action } = props;

  return (
    <Button
      mode="elevated"
      style={[GlobalStyles.buttonStyle, { marginBottom: 10 }]}
      icon={icon}
      buttonColor={GlobalStyles.yellowBackColor}
      textColor={GlobalStyles.yellowTextColor}
      onPress={action}
    >
      {text}
    </Button>
  );
};

export default OptionButtons;
