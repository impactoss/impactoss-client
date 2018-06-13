import coolorsToHex from 'coolors-to-hex';

import headerLogo from 'themes/media/headerLogo.png';
import headerLogo2x from 'themes/media/headerLogo@2x.png';

import graphicHome from 'themes/media/homeGraphic.png';
import graphicHome2x from 'themes/media/homeGraphic@2x.png';
import titleHome from 'themes/media/homeTitle.png';
import titleHome2x from 'themes/media/homeTitle@2x.png';

import impactossLogo from 'themes/media/impactoss.png';
import impactossLogo2x from 'themes/media/impactoss@2x.png';

import partner1 from 'themes/media/partner1.png';
import partner2 from 'themes/media/partner2.png';
import partner3 from 'themes/media/partner3.png';
import partner4 from 'themes/media/partner4.png';
import partner1x2x from 'themes/media/partner1@2x.png';
import partner2x2x from 'themes/media/partner2@2x.png';
import partner3x2x from 'themes/media/partner3@2x.png';
import partner4x2x from 'themes/media/partner4@2x.png';

const theme = {};

// image files
// pass array for retina images: [normalSrc, retinaSrc],
// or single image: src
theme.media = {
  headerLogo: [headerLogo, headerLogo2x],
  graphicHome: [graphicHome, graphicHome2x],
  titleHome: [titleHome, titleHome2x],
  impactossLogo: [impactossLogo, impactossLogo2x],
  // up to 6 partner logos,
  // link text and title to be set in translations/[lang].js > app.components.Footer.partners.[]
  partnerLogos: [
    [partner1, partner1x2x],
    [partner2, partner2x2x],
    [partner3, partner3x2x],
    [partner4, partner4x2x],
  ],
};

// grid-styles settings https://github.com/jxnblk/grid-styled
theme.gutter = 20;
theme.breakpoints = {
  small: '769px',
  medium: '993px',
  large: '1200px',
};

// global color palettes
// primary color palette: dark to light
// 0: main colour, darker, used for links and navigation elements, hover (AA)
// 1: main colour, used for text links/buttons on light grey (AA Large on f1f4f4 )
// 2: main colour, used for links and navigation elements (AA large on white)
// 3: white/placeholder
// 4: white/placeholder
const primary = coolorsToHex('https://coolors.co/0063b5-0070cc-0077d8-ffffff-ffffff');
  // secondary color palette: dark to light
  // 0: secondary colour, dark / white/placeholder
  // 1: secondary colour, medium / white/placeholder
  // 2: secondary colour, main / white/placeholder
  // 3: white/placeholder
  // 4: white/placeholder
const secondary = coolorsToHex('https://coolors.co/ffffff-ffffff-ffffff-ffffff-ffffff');
// dark grayscale: dark to light
// 0:  darkest (AA)
// 1:  darker (AA)
// 2:  dark (AA)
// 3:  medium gray 1 (AA) --- !!! AA compatible with light[0]
// 4:  medium gray 2 (AA large)
const dark = coolorsToHex('https://coolors.co/1c2121-232b2b-323e3e-687271-8d9696');
// light grayscale: light to dark
// 0:  lightest gray (background colour) - also used in global-styles.js !!! AA compatible with dark[3]
// 1:  light gray (light lines, navigation filter panel)
// 2:  gray 1 (gray pattern)
// 3:  gray 2 (icons light)
// 4:  gray 3 (dark lines)
const light = coolorsToHex('https://coolors.co/f1f4f4-e0e6e6-d5dddd-cdd6d6-c7d1d1');

// other palettes
// 0: AA on light[0] and on error[3]
// 1: AA on white
const error = coolorsToHex('https://coolors.co/b20e0e-c10f0f-d31717-f2e3e3-ffffff');
const success = coolorsToHex('https://coolors.co/00632e-007034-007c3a-e1f2ed-ffffff');
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
    '#8D95A0', // default, not used
    '#0059A3', // 1: Human Rights Body
    '#0077D8', // 2: UN session
    '#007C70', // 3: Human right
    '#05A763', // 4: Affected persons
    '#B7177A', // 5: Thematic cluster
    '#114060', // 6: Organisation
    '#009ED8', // 7: SDGs
    '#416680', // 8: State
    '#E56700', // 9: SMART
  ],
  taxonomiesHover: [
    '#656F75', // default, not used
    '#005296', // 1: Human Rights Body
    '#0070CC', // 2: UN session
    '#007267', // 3: Human right
    '#008740', // 4: Affected persons
    '#A5156E', // 5: Thematic cluster
    '#0F364C', // 6: Organisation
    '#007FAD', // 7: SDGs
    '#395970', // 8: State
    '#C75300', // 9: SMART
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
  measuresHover: ['#C75300'], // FFC107  AA compliant
  measures: ['#ED7000'],
  recommendationsHover: ['#023066', '#426BA6'], // accepted, noted ['#FF9B69', '#FFB28B'],
  recommendations: ['#033A89', '#6889B8'],
  sdgtargetsHover: ['#007FAD'],
  sdgtargets: ['#009ED8'], // 40D7FF, 00A0CC
  indicatorsHover: ['#15881A'],
  indicators: ['#1BAC29'],
  reportsHover: [error[1]],
  reports: [error[0]],
  attributesHover: [dark[2]],
  attributes: [dark[3]],
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
  link: [primary[2], primary[1], dark[0], primary[4]],
  linkHover: [primary[0], primary[0], primary[2], light[1]],

  // home: [ '#bg' ],
  home: [primary[4]],
  homeIntro: [dark[2]],

  // footer: [ '#color, #bg-main', #bg-partners, #borderColor ],
  footer: [light[4], dark[2], light[0], dark[1]],
  footerLinks: [primary[4]],
  footerLinksHover: [primary[2]],

  // header: [ '#bg' ],
  header: [secondary[1]],

  // headerBrand: [ '#title', '#claim' ],
  headerBrand: [dark[0], dark[3]],
  headerBrandHover: [dark[1], dark[3]], // WARNING component sets opacity

  // headerNavPages: [ '#bg' ],
  headerNavPages: [light[0]],
  // headerNavPagesItem: [ '#color', '#colorActive', '#bg', '#bgActive' ],
  headerNavPagesItem: [dark[3], primary[4], 'transparent', primary[2]],
  headerNavPagesItemHover: [dark[2], primary[4], 'transparent', primary[0]],

  // headerNavAccount: [ '#bg' ],
  headerNavAccount: ['transparent'],
  // headerNavAccountItem: ['#color', '#colorActive', '#bg', '#bgActive', '#border' ]
  headerNavAccountItem: [primary[4], primary[4], dark[2], primary[2], dark[0]],
  headerNavAccountItemHover: [primary[4], primary[4], dark[1], primary[2], dark[2]],

  // headerNavMain: [ '#bg', '#border'  ],
  headerNavMain: [secondary[4], secondary[4]],
  // headerNavMainItem: ['#color', '#colorActive', '#bg', '#bgActive'],
  headerNavMainItem: [dark[3], primary[4], 'transparent', dark[2]],
  headerNavMainItemHover: [dark[2], primary[4], 'transparent', dark[1]],

  //
  // SIDEBAR "PALETTES" //////////////////////////////////////////////////////////////
  //
  // aside: ['#bg']
  aside: [primary[4]],
  // asideHeader: ['#bg']
  asideHeader: [light[0]],

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
  buttonDefault: [primary[4], primary[2]], // with background
  buttonDefaultHover: [primary[4], primary[0]],
  buttonDefaultDisabled: [light[0], dark[3]], // with background disabled
  // buttonPrimary: ['#text', '#bg', '#border'],
  buttonDefaultIconOnly: [primary[4], primary[2], primary[1]], // with background, without text
  buttonDefaultIconOnlyHover: [primary[4], primary[0], primary[0]],
  // buttonSecondary: ['#text', '#bg'],
  // buttonSecondary: [secondary[4], secondary[1]],
  // buttonSecondaryHover: [secondary[4], secondary[0]],
  // buttonToggleInactive: ['#color', '#bg'],
  buttonToggleInactive: [dark[2], light[1]], // list sidebar filter/edit toggle button
  buttonToggleInactiveHover: [dark[2], light[0]],
  // ButtonInverse: ['#color', '#bg'],
  buttonInverse: [primary[2], primary[4]], // used for taxonomy tags, background only
  buttonInverseHover: [primary[0], primary[4]],
};

// fonts
theme.fonts = {
  // also see global-styles.js for primary font
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
    markdownMobile: '16px',
    small: '13px', // used for labels
    smallMobile: '11px', // used for labels
  },
  // px only
  aside: {
    header: {
      height: 90,
    },
    width: {
      small: 250,
      large: 300,
    },
  },
  mainListItem: {
    paddingHorizontal: 15,
    paddingTop: 5,
    paddingBottom: 10,
  },
  header: {
    banner: {
      height: 88,
      heightMobile: 50,
    },
    nav: {
      height: 38,
      heightMobile: 24,
    },
    // px or em
    text: {
      title: '2.2em',
      titleMobile: '1em',
      claim: '0.85em',
      claimMobile: '1em',
    },
    paddingLeft: {
      mobile: 6,
      small: 12,
      large: 20,
    },
  },
  home: {
    // px or em
    text: {
      title: '2.8em',
      titleMobile: '1.4em',
      claim: '1.3em',
      claimMobile: '1em',
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
  header: 'url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20260%2088%22%3E%3Ctitle%3Epattern3%3C%2Ftitle%3E%3Cg%20id%3D%22Layer_5%22%20data-name%3D%22Layer%205%22%3E%3Cpath%20d%3D%22M35.42%2C30.74h-18V26.52h18Zm0%2C3.46v4.23H11.73V34.2h23.7Zm-.5.5h-5.2v3.23h5.2ZM59.17%2C68.93h-18v4.23h18Zm0%2C7.69v4.22H35.48V76.62h23.7Zm-.5.5h-5.2v3.22h5.2ZM100.17%2C4.93h-18V9.16h18Zm0%2C7.69v4.22H76.48V12.62h23.7Zm-.5.5h-5.2v3.22h5.2Zm26.49%2C41.81h-18v4.23h18Zm0%2C7.69v4.22h-23.7V62.62h23.7Zm-.5.5h-5.2v3.22h5.2Zm58.74-32.19h-18v4.23h18Zm0%2C7.69v4.22h-23.7V38.62h23.7Zm-.5.5h-5.2v3.22h5.2Zm40.62%2C30.69h-18V74h18Zm0%2C7.68v4.23h-23.7V77.49h23.7Zm-.5.5h-5.2v3.23h5.2Zm14.5-72.68h-18V9.54h18Zm0%2C7.68v4.23h-23.7V13h23.7Zm-.5.5h-5.2v3.23h5.2ZM80.25%2C23.17%22%20style%3D%22fill%3A%23f1f4f4%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E")',
  asideHeader: 'url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20226.82%2082.78%22%3E%3Ctitle%3Epattern3%3C%2Ftitle%3E%3Cg%20id%3D%22Layer_5%22%20data-name%3D%22Layer%205%22%3E%3Cpath%20d%3D%22M35.42%2C30.74h-18V26.52h18Zm0%2C3.46v4.23H11.73V34.2h23.7Zm-.5.5h-5.2v3.23h5.2ZM59.17%2C74.93h-18v4.23h18Zm0%2C7.69v4.22H35.48V82.62h23.7Zm-.5.5h-5.2v3.22h5.2ZM100.17%2C4.93h-18V9.16h18Zm0%2C7.69v4.22H76.48V12.62h23.7Zm-.5.5h-5.2v3.22h5.2Zm26.49%2C41.81h-18v4.23h18Zm0%2C7.69v4.22h-23.7V62.62h23.7Zm-.5.5h-5.2v3.22h5.2Zm58.74-32.19h-18v4.23h18Zm0%2C7.69v4.22h-23.7V38.62h23.7Zm-.5.5h-5.2v3.22h5.2Zm40.62%2C36.69h-18V80h18Zm0%2C7.68v4.23h-23.7V83.49h23.7Zm-.5.5h-5.2v3.23h5.2Zm14.5-78.68h-18V9.54h18Zm0%2C7.68v4.23h-23.7V13h23.7Zm-.5.5h-5.2v3.23h5.2ZM80.25%2C23.17%22%20transform%3D%22translate%28-11.73%20-4.93%29%22%20style%3D%22fill%3A%23f1f4f4%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E")',
};

export default theme;
