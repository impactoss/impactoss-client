import coolorsToHex from 'coolors-to-hex';

const theme = {};

// grid-styles settings https://github.com/jxnblk/grid-styled
theme.gutter = 20;
theme.breakpoints = {
  small: '768px',
  medium: '992px',
  large: '1200px',
};

// global color palettes
// primary color palette: dark to light
// 0: main colour, darker, used for links and navigation elements, hover
// 1: main colour, used for links and navigation elements
// 2: main colour, light
// 3: main colour, lighter (UNUSED)
// 4: white
const primary = coolorsToHex('https://coolors.co/048e47-099b50-07aa51-09b757-ffffff');
  // secondary color palette: dark to light
  // 0: dark header colour, darker
  // 1: dark header colour
  // 2: dark header colour, lighter (UNUSED)
  // 3: white/placeholder
  // 4: white/placeholder
const secondary = coolorsToHex('https://coolors.co/01527A-015C89-026b9f-027dbb-ffffff');

// dark grayscale: dark to light
// 0:  off black
// 1:  off black lighter
// 2:  charcoal
// 3:  light charcoal
// 4:  white
const darker = coolorsToHex('https://coolors.co/191e21-21282b-293135-384349-ffffff');

// dark grayscale: dark to light
// 0:  darkest gray
// 1:  dark gray
// 2:  gray
// 3:  medium gray 1 (AA conform)
// 4:  medium gray 2 (AA large conform on white)
const dark = coolorsToHex('https://coolors.co/3e4b51-47545b-56656d-6a7880-8b969c');

// light grayscale: light to dark
// 0:  lightest gray (background colour) - also used in global-styles.js
// 1:  light gray (light lines, navigation filter panel)
// 2:  gray 1 (gray pattern)
// 3:  gray 2 (icons light)
// 4:  gray 3 (dark lines)
const light = coolorsToHex('https://coolors.co/f5f6f6-eaeced-dbdfe0-bbc1c2-aeb6b7');


// other palettes (not currently used)
const error = coolorsToHex('https://coolors.co/ce4f40-e25646-e46556-e77467-e98478');
const alert = coolorsToHex('https://coolors.co/ffa000-ffc107-ffd761-ffecb3-fff2ce');
const success = coolorsToHex('https://coolors.co/388e3c-4caf50-7cc47f-9fd4a1-c8e6c9');

// colour palettes, usage:
//   import { palette } from 'styled-theme';
//   color: ${palette('primary', 0)}
// styled-theme settings https://github.com/diegohaz/styled-theme
theme.palette = {

  // global theme colours
  primary,
  secondary,
  darker,
  dark,
  light,

  // other palettes (not currently used)
  error,
  success,
  alert,

  // taxonomy/category colours
  // 0: default/fallback
  // 1: Human Rights Body
  // 2: UN session
  // 3: Country
  // 4: SDGs
  // 5: Issue
  // 6: Population group
  // 7: SMART
  // 8: Agency
  taxonomies: [
    '#E8EAEB',
    '#6444AF',
    '#88338E',
    '#C27DE0',
    '#00AEEF',
    '#00A088',
    '#00C4B3',
    '#027DBB',
    '#01527A',
    '#ffffff',
  ],
  taxonomiesHover: [
    '#DBDCDD',
    '#523890',
    '#924598',
    '#B172CC',
    '#0099D1',
    '#00927C',
    '#00B3A3',
    '#026B9F',
    '#014A6F',
    '#014A6F',
  ],

  // other entities
  measures: ['#F9C907'],
  measuresHover: ['#E3B707'],
  sdgtargets: ['#00AEEF'],
  sdgtargetsHover: ['#009FDA'],
  indicators: ['#DB153D'],
  indicatorsHover: ['#C81438'],
  reports: ['#DB153D'],
  reportsHover: ['#C81438'],
  recommendations: ['#027DBB'],
  recommendationsHover: ['#026B9F'],
  attributes: ['#56656D'],
  attributesHover: ['#47545B'],


  //
  // HEADER "PALETTES" //////////////////////////////////////////////////////////////
  //

  // header: [ '#bg' ],
  header: [secondary[3]],

  // headerBrand: [ '#title', '#claim' ],
  headerBrand: [primary[4], primary[4]],
  headerBrandHover: [primary[4], primary[4]], // WARNING component sets opacity

  // headerNavPages: [ '#bg' ],
  headerNavPages: [secondary[3]],
  // headerNavPagesItem: [ '#color', '#colorActive', '#bg', '#bgActive' ],
  headerNavPagesItem: [primary[4], primary[4], 'transparent', secondary[0]],
  headerNavPagesItemHover: [primary[4], primary[4], secondary[1], secondary[1]],

  // headerNavAccount: [ '#bg' ],
  headerNavAccount: ['transparent'],
  // headerNavAccountItem: ['#color', '#colorActive', '#bg', '#bgActive', '#border' ]
  headerNavAccountItem: [primary[4], primary[4], secondary[2], secondary[1], secondary[1]],
  headerNavAccountItemHover: [primary[4], primary[4], secondary[1], secondary[1], secondary[1]],

  // headerNavMain: [ '#bg', '#border'  ],
  headerNavMain: [secondary[3], secondary[2]],
  // headerNavMainItem: ['#color', '#colorActive', '#bg', '#bgActive'],
  headerNavMainItem: [primary[4], primary[4], 'transparent', secondary[2]],
  headerNavMainItemHover: [primary[4], primary[4], secondary[2], secondary[2]],

  //
  // SIDEBAR "PALETTES" //////////////////////////////////////////////////////////////
  //
  // aside: ['#bg']
  aside: [primary[4]],

  // CATEGORY SIDEBAR "PALETTES" //////////////////////////////////////////////////////////////
  // asideCatNavItem: ['#color', '#colorActive', '#bg', '#bgActive', '#border'],
  asideCatNavItem: [dark[2], primary[4], primary[4], primary[1], light[1]],
  asideCatNavItemHover: [dark[2], primary[4], light[0], primary[0], light[1]],

  // ENTITYLIST SIDEBAR "PALETTES" //////////////////////////////////////////////////////////////
  // asideCatNavItem: ['#color', '#active', '#bg', '#bgactive', '#border'],
  asideListItem: [dark[2], primary[4], primary[4], dark[2], light[1]],
  asideListItemHover: [dark[2], primary[4], light[0], dark[1], light[2]],

  //
  // BUTTONS / LINKS
  //
  // button: ['#colorPrimary', '#colorSecondary'],
  buttonFlat: [primary[1], dark[3]],
  buttonFlatHover: [primary[0], primary[1]],
  // buttonDefault: ['#text', '#bg'],
  buttonDefault: [primary[4], primary[1]],
  buttonDefaultHover: [primary[4], primary[0]],
  // buttonPrimary: ['#text', '#bg', '#border'],
  buttonDefaultIconOnly: [primary[1], 'transparent', primary[1]],
  buttonDefaultIconOnlyHover: [primary[0], 'transparent', primary[0]],
  // buttonSecondary: ['#text', '#bg'],
  buttonSecondary: [secondary[4], secondary[1]],
  buttonSecondaryHover: [secondary[4], secondary[0]],
  // buttonToggleInactive: ['#color', '#bg'],
  buttonToggleInactive: [dark[1], light[1]],
  buttonToggleInactiveHover: [dark[1], light[0]],
  // links
  // also see global-styles.js for default link "a"
  link: [secondary[3]],
  linkHover: [secondary[2]],
  linkSecondary: [secondary[3]],
  linkSecondaryHover: [secondary[2]],

};

// fonts
theme.fonts = {
  // also see global-styles.js for primary font
  secondary: 'Rubik, Helvetica, Arial, sans-serif', // used for brand title, claim, nav items, buttons and labels
  pre: 'Consolas, Liberation Mono, Menlo, Courier, monospace',
  quote: 'Georgia, serif',
  brandMain: 'Roboto, Helvetica Neue, Helvetica, Arial, sans-serif',
  brandClaim: 'Roboto, Helvetica Neue, Helvetica, Arial, sans-serif',
};

// sizes
theme.sizes = {
  // also see global-styles.js for other sizes
  brandMain: '1.6em',
  brandClaim: '1.8em',
};

// end styled-theme settings

// other global theme variables
// eg transitions
theme.transitions = {
  mouseOver: '0.2s',
};

theme.backgroundImages = {
  header: 'url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20viewBox%3D%220%200%20240%20105%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22a%22%20x1%3D%22120%22%20y1%3D%22-77.06%22%20x2%3D%22120%22%20y2%3D%22103.51%22%20gradientUnits%3D%22userSpaceOnUse%22%3E%3Cstop%20offset%3D%220.22%22%20stop-color%3D%22%23026b9f%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23027dbb%22%2F%3E%3C%2FlinearGradient%3E%3C%2Fdefs%3E%3Ctitle%3Epattern-2%3C%2Ftitle%3E%3Cpath%20d%3D%22M75%2C60H45V90H15v15H0V75H30V45H60V15H90V0h15V30H75ZM15%2C30H45V0H30V15H0V60H15Zm120%2C0h30V0H150V15H120V45H90V75H60v30H75V90h30V60h30Zm60%2C0h30V0H210V15H180V45H150V75H120v30h15V90h30V60h30Zm15%2C15V75H180v30h15V90h30V60h15V45Z%22%20style%3D%22fill%3Aurl%28%23a%29%22%2F%3E%3C%2Fsvg%3E")',
};

export default theme;
