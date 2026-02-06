export interface Theme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
  };
}

export interface AppThemes {
  [themeName: string]: Theme;
}
