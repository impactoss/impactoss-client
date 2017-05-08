import coolorsToHex from 'coolors-to-hex';
import { reversePalette } from 'styled-theme/composer';

const theme = {};

// grid-styles settings https://github.com/jxnblk/grid-styled
theme.gutter = 20;
theme.breakpoints = {
  small: '768px',
  medium: '992px',
  large: '1200px',
};


// styled-theme settings https://github.com/diegohaz/styled-theme

// color palettes
theme.palette = {
  primary: coolorsToHex('https://coolors.co/eb6e51-d66149-182635-34404d-ffffff'),
  // 0: main colour links and navigation elements
  // 1: main colour links and navigation elements, hover
  // 2: main header colour
  // 3: main header colour, background
  // 4: white
  secondary: coolorsToHex('https://coolors.co/ff9b69-ffb996-ffffff-ffffff-ffffff'),
  // 0: secondary colour peach
  // 1: secondary colour light peach
  // 2: white
  // 3: white
  // 4: white
  danger: coolorsToHex('https://coolors.co/ce4f40-e25646-e46556-e77467-e98478'),
  alert: coolorsToHex('https://coolors.co/ffa000-ffc107-ffd761-ffecb3-fff2ce'),
  success: coolorsToHex('https://coolors.co/388e3c-4caf50-7cc47f-9fd4a1-c8e6c9'),
  grayscaleFonts: coolorsToHex('https://coolors.co/1d3033-344547-4a595c-6c787a-899395'),
  // 0:  darkest (sadata black)
  // 1:  dark (sadata dark grey)
  // 2:  almost dark (sadata medium grey)
  // 3:  medium grey 1 (AA conform)
  // 4:  medium grey 2 (AA large conform)
  grayscale: coolorsToHex('https://coolors.co/f1f3f3-e8eaeb-d2d6d6-bbc1c2-a5acad'),
  // 0:  lightest grey (background colour) - also used in global-styles.js
  // 1:  light grey (light lines, navigation filter panel)
  // 2:  grey 1 (grey pattern)
  // 3:  grey 2 (icons light)
  // 4:  grey 3 (dark lines)
  taxonomies: ['#E8EAEB', '#6B3285', '#5149AD', '#75D6AC', '#26938C', '#55B542', '#0069A4', '#199CD4'],
  taxonomiesHover: ['#DBDCDD', '#622E79', '#4A439E', '#65C99B', '#238680', '#4EA53C', '#006096', '#178EC1'],
  // 0: default/fallback
  // 1: Human Rights Body
  // 2: UN session
  // 3: Human right
  // 4: Affected persons
  // 5: Thematic cluster
  // 6: Organisation
  // 7: SDGs
  actions: ['#FFC107'],
  actionsHover: ['#F2B200'],
  indicators: ['#EB6E51'],
  indicatorsHover: ['#D66149'],
  recommendations: ['#FF9B69'],
  recommendationsHover: ['#F48B5D'],
};
theme.reversePalette = reversePalette(theme.palette);

// fonts
theme.fonts = {
  primary: 'Roboto, Helvetica, sans-serif', // also used in global-styles.js
  secondary: 'Rubik, Roboto, Helvetica, sans-serif',
  pre: 'Consolas, Liberation Mono, Menlo, Courier, monospace',
  quote: 'Georgia, serif',
};

// sizes
theme.sizes = {
  h1: '2em',
};

// end styled-theme settings

// other global theme variables
// eg transitions
theme.transitions = {
  mouseOver: '0.2s',
};

export default theme;
