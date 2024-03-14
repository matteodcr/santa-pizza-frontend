import { rem, Switch, useMantineColorScheme, useMantineTheme } from '@mantine/core';
import { IconMoonStars, IconSun } from '@tabler/icons-react';
import React, { useState } from 'react';

export function ColorSchemeToggle() {
  const { setColorScheme, colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();

  function isThemeLight(): boolean {
    if (colorScheme === 'light') {
      return true;
    }
    if (colorScheme === 'dark') {
      return false;
    }
    return false;
  }

  const [checked, setChecked] = useState(isThemeLight());

  function handleChecked() {
    if (checked) {
      setColorScheme('dark');
    } else {
      setColorScheme('light');
    }
    setChecked(!checked);
  }

  const sunIcon = (
    <IconSun
      style={{ width: rem(16), height: rem(16) }}
      stroke={2.5}
      color={theme.colors.yellow[4]}
    />
  );

  const moonIcon = (
    <IconMoonStars
      style={{ width: rem(16), height: rem(16) }}
      stroke={2.5}
      color={theme.colors.blue[6]}
    />
  );

  return (
    <Switch
      checked={checked}
      onChange={() => handleChecked()}
      size="md"
      color="dark.4"
      onLabel={sunIcon}
      offLabel={moonIcon}
    />
  );
}
