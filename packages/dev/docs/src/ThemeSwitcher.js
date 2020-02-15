import {ActionButton} from '@react-spectrum/button';
import Light from '@spectrum-icons/workflow/Light';
import Moon from '@spectrum-icons/workflow/Moon';
import {Provider} from '@react-spectrum/provider';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import ReactDOM from 'react-dom';
import styles from './docs.css';
import {theme} from '@react-spectrum/theme-default';

function useCurrentColorScheme() {
  let mq = useMemo(() => window.matchMedia('(prefers-color-scheme: dark)'), []);
  let getCurrentColorScheme = useCallback(() => localStorage.theme || (mq.matches ? 'dark' : 'light'), [mq]);
  let [colorScheme, setColorScheme] = useState(() => getCurrentColorScheme());

  useEffect(() => {
    let onChange = () => {
      setColorScheme(getCurrentColorScheme());
    };

    mq.addListener(onChange);
    window.addEventListener('storage', onChange);
    return () => {
      mq.removeListener(onChange);
      window.removeEventListener('storage', onChange);
    };
  }, [getCurrentColorScheme, mq]);

  return colorScheme;
}

export function ThemeProvider({children, UNSAFE_className}) {
  let colorScheme = useCurrentColorScheme();

  return (
    <Provider theme={theme} colorScheme={colorScheme} UNSAFE_className={UNSAFE_className}>
      {children}
    </Provider>
  );
}

export function Example({children}) {
  return <ThemeProvider UNSAFE_className={styles.example}>{children}</ThemeProvider>;
}

function ThemeSwitcher() {
  let colorScheme = useCurrentColorScheme();
  let onPress = () => {
    localStorage.theme = (colorScheme === 'dark' ? 'light' : 'dark');
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <ActionButton 
      icon={colorScheme === 'dark' ? <Light /> : <Moon />}
      aria-label={colorScheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      onPress={onPress}
      position="fixed"
      top="size-400"
      end="size-400" />
  );
}

ReactDOM.render(<ThemeSwitcher />, document.getElementById('themeSwitcher'));