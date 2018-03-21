import coolorsToHex from 'coolors-to-hex';

import headerLogo from 'themes/media/headerLogo.png';
import headerLogo2x from 'themes/media/headerLogo@2x.png';

import graphicHome from 'themes/media/homeGraphic.png';
import graphicHome2x from 'themes/media/homeGraphic@2x.png';
// import titleHome from 'themes/media/homeTitle.png';
// import titleHome2x from 'themes/media/homeTitle@2x.png';

import impactossLogo from 'themes/media/impactoss.png';
import impactossLogo2x from 'themes/media/impactoss@2x.png';

// import partner1 from 'themes/media/partner1.png';
// import partner2 from 'themes/media/partner2.png';
// import partner3 from 'themes/media/partner3.png';
// import partner4 from 'themes/media/partner4.png';
// import partner1x2x from 'themes/media/partner1@2x.png';
// import partner2x2x from 'themes/media/partner2@2x.png';
// import partner3x2x from 'themes/media/partner3@2x.png';
// import partner4x2x from 'themes/media/partner4@2x.png';

const theme = {};

// image files
// pass array for retina images: [normalSrc, retinaSrc],
// or single image: src
theme.media = {
  headerLogo: [headerLogo, headerLogo2x],
  graphicHome: [graphicHome, graphicHome2x],
  // titleHome: [titleHome, titleHome2x],
  impactossLogo: [impactossLogo, impactossLogo2x],
  // up to 6 partner logos,
  // link text and title to be set in translations/[lang].js > app.components.Footer.partners.[]
  // partnerLogos: [
  //   [partner1, partner1x2x],
  //   [partner2, partner2x2x],
  //   [partner3, partner3x2x],
  //   [partner4, partner4x2x],
  // ],
};

// grid-styles settings https://github.com/jxnblk/grid-styled
theme.gutter = 20;
theme.breakpoints = {
  small: '768px',
  medium: '992px',
  large: '1200px',
};

// global color palettes
// primary color palette: dark to light
// 0: main colour, darker, used for links and navigation elements, hover (AA)
// 1: main colour, used for text links/buttons on light grey (AA Large on f1f4f4 )
// 2: main colour, used for links and navigation elements (AA large on white)
// 3: white/placeholder
// 4: white/placeholder
// const primary = coolorsToHex('https://coolors.co/0063b5-0070cc-0077d8-ffffff-ffffff');
const primary = coolorsToHex('https://coolors.co/048e47-099b50-07aa51-09b757-ffffff');
  // secondary color palette: dark to light
  // 0: secondary colour, dark / white/placeholder
  // 1: secondary colour, medium / white/placeholder
  // 2: secondary colour, main / white/placeholder
  // 3: white/placeholder
  // 4: white/placeholder
// const secondary = coolorsToHex('https://coolors.co/ffffff-ffffff-ffffff-ffffff-ffffff');
const secondary = coolorsToHex('https://coolors.co/01527A-015C89-026b9f-027dbb-ffffff');

// dark grayscale: dark to light
// 0:  off black
// 1:  off black lighter
// 2:  charcoal
// 3:  light charcoal
// 4:  white
const darker = coolorsToHex('https://coolors.co/191e21-21282b-293135-384349-ffffff');

// dark grayscale: dark to light
// 0:  darkest (AA)
// 1:  darker (AA)
// 2:  dark (AA)
// 3:  medium gray 1 (AA) --- !!! AA compatible with light[0]
// 4:  medium gray 2 (AA large)
// const dark = coolorsToHex('https://coolors.co/1c2121-232b2b-323e3e-687271-8d9696');
const dark = coolorsToHex('https://coolors.co/3e4b51-47545b-56656d-6a7880-8b969c');

// light grayscale: light to dark
// 0:  lightest gray (background colour) - also used in global-styles.js !!! AA compatible with dark[3]
// 1:  light gray (light lines, navigation filter panel)
// 2:  gray 1 (gray pattern)
// 3:  gray 2 (icons light)
// 4:  gray 3 (dark lines)
// const light = coolorsToHex('https://coolors.co/f1f4f4-e0e6e6-d5dddd-cdd6d6-c7d1d1');
const light = coolorsToHex('https://coolors.co/f5f6f6-eaeced-dbdfe0-bbc1c2-aeb6b7');

// other palettes
// 0: AA on light[0] and on error[3]
// 1: AA on white
const error = coolorsToHex('https://coolors.co/a41d23-b22026-c3292e-f1e4e4-ffffff');
const success = coolorsToHex('https://coolors.co/048e47-099b50-07aa51-09b757-ffffff');
// const alert = coolorsToHex('https://coolors.co/c75300-e56700-ed7000-f97807-ffffff');
// const info = coolorsToHex('https://coolors.co/0063b5-0070cc-0077d8-118ef4-ffffff');

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

  // other palettes
  error,
  success,
  // alert,
  // info,

  // taxonomy/category colours
  // [0: default, 1: Human Rights Body, 2: UN session, 3: Human right, 4: Affected persons, 5: Thematic cluster, 6: Organisation, 7: SDGs, 8: State, 9: SMART]
  // taxonomies: ['#E8EAEB', '#6B3285', '#5149AD', '#75D6AC', '#26938C', '#55B542', '#0069A4', '#199CD4', '#40D7FF'],
  // taxonomiesAAL: ['#8C969B', '#6B3285', '#5149AD', '#31A573', '#26938C', '#4DA53B', '#0069A4', '#199CD4', '#8C969B'],
  // [#AA compliant]
  // taxonomiesHoverAAL: ['#6D787E', '#3A1D49', '#3B3681', '#28865D', '#21827B', '#3D832F', '#003A5C', '#147CA9', '#6D787E'],
  taxonomies: [
    '#E8EAEB', // 0: default/fallback
    '#0059A3', // 1: Human Rights Body
    '#0077D8', // 2: UN session
    '#687E8D', // 3: Country
    '#009ED8', // 4: SDGs
    '#7A52A3', // 5: Issue
    '#BE4180', // 6: Population group
    '#D97720', // 7: SMART // '#E56700',
    '#0D5273', // 8: Agency
    '#383838', // unused
  ],
  taxonomiesHover: [
    '#DBDCDD', // 0: default/fallback
    '#005296', // 1: Human Rights Body
    '#0070CC', // 2: UN session
    '#596B78', // 3: Country
    '#007FAD', // 4: SDGs
    '#704B95', // 5: Issue
    '#AF3C75', // 6: Population group
    '#B35F00', // 7: SMART // '#C75300',
    '#0B4560', // 8: Agency
    '#383838', // unused
  ],
  // bg inactive, bg hover, icon
  smartInactive: [
    '#DBE1E1', // SMART inactive - NOT ACCESSIBLE
    '#656F75', // SMART inactive hover
    '#9BABAB', // SMART icon
  ],

  // other entities
  // [aqll #AA compliant]
  // maybe [#AA-Large compliant] 18pt/24px or 14pt/19px bold can suffice with AA com,pliant hover if agreed by customer
  measuresHover: ['#048E47'], // ['#E3B707'],
  measures: ['#099B50'], // ['#F9C907'],
  recommendationsHover: ['#0B537A', '#126FA1'], // accepted, noted ['#FF9B69', '#03405F'],
  recommendations: ['#0D608E', '#147EB9'], // accepted, noted ['#FF9B69', '#045984'],
  sdgtargetsHover: ['#007FAD'],
  sdgtargets: ['#009ED8'], // 40D7FF, 00A0CC
  indicatorsHover: ['#06562D'],
  indicators: ['#0A6B39'],
  reportsHover: [error[1]],
  reports: [error[0]],
  attributesHover: ['#47545B'],
  attributes: ['#56656D'],
  // attributesHover: [dark[2]],
  // attributes: [dark[3]],
  rolesHover: [dark[2]],
  roles: [dark[3]],

  //
  // UI PALETTES //////////////////////////////////////////////////////////////
  //

  // text
  // [#primaryFont, #secondaryFont, #inverse]
  text: [dark[0], dark[3], primary[4]],
  background: [primary[4], light[0], secondary[0]],

  // links
  // also see global-styles.js for default link "a"
  // [#primaryLink, #linkOnLightBackground, #textColorLink, #linkOnDark]
  link: [secondary[3], primary[1], dark[0], primary[4]],
  linkHover: [secondary[2], primary[0], primary[2], light[1]],

  // home: [ '#bg' ],
  home: [secondary[3]],
  homeIntro: [light[2]],

  // footer: [ '#color, #bg-main', #bg-partners, #borderColor ],
  footer: [primary[4], secondary[1], light[0], secondary[0]],
  footerLinks: [primary[4]],
  footerLinksHover: [primary[4]],

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
  // asideHeader: ['#bg']
  asideHeader: [light[2]],

  // CATEGORY SIDEBAR "PALETTES" //////////////////////////////////////////////////////////////
  // asideCatNavItem: ['#color', '#colorActive', '#bg', '#bgActive', '#border'],
  asideCatNavItem: [dark[2], primary[4], primary[4], primary[2], light[0]],
  asideCatNavItemHover: [dark[1], primary[4], light[0], primary[2], light[0]],

  // ENTITYLIST SIDEBAR "PALETTES" //////////////////////////////////////////////////////////////
  // asideCatNavItem: ['#color', '#active', '#bg', '#bgactive', '#border'],
  asideListItem: [dark[2], primary[4], primary[4], dark[2], light[0]],
  asideListItemHover: [dark[1], primary[4], primary[4], dark[2], light[0]],

  // asideHeader: [#color, '#bg',]
  asideListGroup: [dark[2], light[1]],
  asideListGroupHover: [dark[3], light[0]],

  // mainListItem: [#color, '#bg',], eg category and entity list items
  mainListItem: [dark[0], primary[4]],
  mainListItemHover: [dark[3], primary[4]],

  // multiselect header [#color, #bg]
  // compare asideListItem
  multiSelectHeader: [primary[4], dark[2]],
  multiSelectFieldButton: [dark[0], light[1]],
  multiSelectFieldButtonHover: [dark[0], light[2]],
  //
  // BUTTONS / LINKS
  //
  // button: ['#colorPrimary', '#colorSecondary', #disabled],
  buttonFlat: [primary[1], dark[3], light[4]], // aka ghost button
  buttonFlatHover: [primary[0], primary[1]],
  buttonCancel: [dark[3]], // form footer cancel
  buttonCancelHover: [primary[1]],
  // buttonDefault: ['#text', '#bg'],
  buttonDefault: [primary[4], primary[1]], // with background
  buttonDefaultHover: [primary[4], primary[0]],
  buttonDefaultDisabled: [light[0], dark[3]], // with background disabled
  // buttonPrimary: ['#text', '#bg', '#border'],
  // buttonDefaultIconOnly: [primary[4], primary[2], primary[1]], // with background, without text
  // buttonDefaultIconOnlyHover: [primary[4], primary[0], primary[0]],
  buttonDefaultIconOnly: [primary[1], 'transparent', primary[1]],
  buttonDefaultIconOnlyHover: [primary[0], 'transparent', primary[0]],
  // buttonSecondary: ['#text', '#bg'],
  buttonSecondary: [secondary[4], secondary[1]],
  buttonSecondaryHover: [secondary[4], secondary[0]],
  // buttonToggleInactive: ['#color', '#bg'],
  buttonToggleInactive: [dark[1], light[1]], // list sidebar filter/edit toggle button
  buttonToggleInactiveHover: [dark[1], light[0]],
  // ButtonInverse: ['#color', '#bg'],
  buttonInverse: [primary[2], primary[4]], // used for taxonomy tags, background only
  buttonInverseHover: [primary[0], primary[4]],
};

// fonts
theme.fonts = {
  // also see global-styles.js for primary font
  secondary: 'Rubik, Helvetica, Arial, sans-serif', // used for brand title, claim, nav items, buttons and labels
  pre: 'Consolas, Liberation Mono, Menlo, Courier, monospace',
  quote: 'Georgia, serif',
  title: 'Roboto, Helvetica Neue, Helvetica, Arial, sans-serif', // only used for fallback
  claim: 'Roboto, Helvetica Neue, Helvetica, Arial, sans-serif', // only used for fallback
};

// sizes
theme.sizes = {
  // also see global-styles.js for other sizes
  // px or em
  text: {
    aaLargeBold: '19px',
    aaLarge: '24px',
    mainListItem: '18px',
    nestedListItem: '15px',
    listItemTop: '14px',
    markdown: '18px',
    small: '13px', // used for labels
  },
  lineHeights: {
    mainListItem: 1.4,
    markdown: 1.4,
  },
  // px only
  aside: {
    header: {
      height: 90,
    },
  },
  mainListItem: {
    paddingHorizontal: 15,
    paddingTop: 5,
    paddingBottom: 10,
  },
  header: {
    banner: {
      height: 105,
    },
    nav: {
      height: 43,
    },
    // px or em
    text: {
      title: '1.6em',
      claim: '1.6em',
    },
  },
  home: {
    // px or em
    text: {
      title: '1.8em',
      claim: '1.8em',
    },
  },
};

// end styled-theme settings

// other global theme variables
// eg transitions
theme.transitions = {
  mouseOver: '0.2s',
};
// requires image in data URI format (not base-64)
// eg use https://dopiaza.org/tools/datauri/index.php to generate string
// and paste between 'url("STRING_HERE")'

theme.backgroundImages = {
  header: 'url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20viewBox%3D%220%200%20240%20105%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22a%22%20x1%3D%22120%22%20y1%3D%22-77.06%22%20x2%3D%22120%22%20y2%3D%22103.51%22%20gradientUnits%3D%22userSpaceOnUse%22%3E%3Cstop%20offset%3D%220.22%22%20stop-color%3D%22%23026b9f%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23027dbb%22%2F%3E%3C%2FlinearGradient%3E%3C%2Fdefs%3E%3Ctitle%3Epattern-2%3C%2Ftitle%3E%3Cpath%20d%3D%22M75%2C60H45V90H15v15H0V75H30V45H60V15H90V0h15V30H75ZM15%2C30H45V0H30V15H0V60H15Zm120%2C0h30V0H150V15H120V45H90V75H60v30H75V90h30V60h30Zm60%2C0h30V0H210V15H180V45H150V75H120v30h15V90h30V60h30Zm15%2C15V75H180v30h15V90h30V60h15V45Z%22%20style%3D%22fill%3Aurl%28%23a%29%22%2F%3E%3C%2Fsvg%3E")',
  asideHeader: 'url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20226.82%2082.78%22%3E%3Ctitle%3Epattern3%3C%2Ftitle%3E%3Cg%20id%3D%22Layer_5%22%20data-name%3D%22Layer%205%22%3E%3Cpath%20d%3D%22M35.42%2C30.74h-18V26.52h18Zm0%2C3.46v4.23H11.73V34.2h23.7Zm-.5.5h-5.2v3.23h5.2ZM59.17%2C74.93h-18v4.23h18Zm0%2C7.69v4.22H35.48V82.62h23.7Zm-.5.5h-5.2v3.22h5.2ZM100.17%2C4.93h-18V9.16h18Zm0%2C7.69v4.22H76.48V12.62h23.7Zm-.5.5h-5.2v3.22h5.2Zm26.49%2C41.81h-18v4.23h18Zm0%2C7.69v4.22h-23.7V62.62h23.7Zm-.5.5h-5.2v3.22h5.2Zm58.74-32.19h-18v4.23h18Zm0%2C7.69v4.22h-23.7V38.62h23.7Zm-.5.5h-5.2v3.22h5.2Zm40.62%2C36.69h-18V80h18Zm0%2C7.68v4.23h-23.7V83.49h23.7Zm-.5.5h-5.2v3.23h5.2Zm14.5-78.68h-18V9.54h18Zm0%2C7.68v4.23h-23.7V13h23.7Zm-.5.5h-5.2v3.23h5.2ZM80.25%2C23.17%22%20transform%3D%22translate%28-11.73%20-4.93%29%22%20style%3D%22fill%3A%23f1f4f4%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E")',
};

export default theme;
