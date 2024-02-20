import coolorsToHex from 'coolors-to-hex';

import headerLogo from 'themes/media/headerLogo.png';
// import headerLogo2x from 'themes/media/headerLogo.png';

import footerLogo1 from 'themes/media/footer-logo-nzgov.png';
import footerLogo2 from 'themes/media/footer-logo-nzjustice.png';

import graphicHome from 'themes/media/homeGraphic.png';
import graphicHome2x from 'themes/media/homeGraphic@2x.png';
import titleHome from 'themes/media/homeTitle.png';
import titleHome2x from 'themes/media/homeTitle@2x.png';

import impactossLogo from 'themes/media/impactossLogo.png';
// import impactossLogo2x from 'themes/media/impactoss@2x.png';

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
  headerLogo: [headerLogo, headerLogo],
  graphicHome: [graphicHome, graphicHome2x],
  titleHome: [titleHome, titleHome2x],
  impactossLogo: [impactossLogo, impactossLogo],
  // up to 6 partner logos,
  // link text and title to be set in translations/[lang].js > app.components.Footer.partners.[]
  partnerLogos: [
    [partner1, partner1x2x],
    [partner2, partner2x2x],
    [partner3, partner3x2x],
    [partner4, partner4x2x],
  ],
  nzGovLogo: [footerLogo1, footerLogo1],
  nzJusticeLogo: [footerLogo2, footerLogo2],
};

// grid-styles settings https://github.com/jxnblk/grid-styled
theme.gutter = 20;

export const BREAKPOINTS = {
  xsmall: {
    min: 0,
    max: 768, // inclusive
    name: 'mobile',
    index: 0,
  },
  // ms: {
  //   min: 420, // exclusive
  //   max: 720,
  //   name: 'mobile (landscape)',
  //   index: 1,
  // },
  small: {
    min: 768, // exclusive
    max: 992,
    name: 'tablet (portrait)',
    index: 2,
  },
  medium: {
    min: 992, // exclusive
    max: 1199,
    name: 'laptop/tablet (landscape)',
    index: 3,
  },
  large: {
    min: 1199, // exclusive
    max: 99999999,
    name: 'desktop',
    index: 4,
  },
  // xxlarge: {
  //   min: 1728, // exclusive
  //   max: 99999999,
  //   name: 'large desktop',
  //   index: 5,
  // },
};

theme.breakpoints = {
  small: `${BREAKPOINTS.small.min + 1}px`, // min
  medium: `${BREAKPOINTS.medium.min + 1}px`, // min
  large: `${BREAKPOINTS.large.min + 1}px`, // min
};

// global color palettes
// primary color palette: dark to light
// 0: main colour, darker, used for links and navigation elements, hover (AA)
// 1: main colour, used for text links/buttons on light grey (AA Large on f1f4f4 )
// 2: main colour, used for links and navigation elements (AA large on white)
// 3: white/placeholder
// 4: white/placeholder
const primary = coolorsToHex('https://coolors.co/73018e-510064-360441-ffffff-ffffff');
// secondary color palette: dark to light
// 0: secondary colour, dark / white/placeholder
// 1: secondary colour, medium / white/placeholder
// 2: secondary colour, main / white/placeholder
// 3: white/placeholder
// 4: white/placeholder
const secondary = coolorsToHex('https://coolors.co/ba5d03-ffffff-ffffff-ffffff-ffffff');
// dark grayscale: dark to light
// 0:  darkest (AA)
// 1:  darker (AA)
// 2:  dark (AA)
// 3:  medium gray 1 (AA) --- !!! AA compatible with light[0]
// 4:  medium gray 2 (AA large)
const dark = coolorsToHex('https://coolors.co/1e1f1f-6b6f73-73777b-cfd0d1-dfe1e3');
// light grayscale: light to dark
// 0:  lightest gray (background colour) - also used in global-styles.js !!! AA compatible with dark[3]
// 1:  light gray (light lines, navigation filter panel)
// 2:  gray 1 (gray pattern)
// 3:  gray 2 (icons light)
// 4:  gray 3 (dark lines)
const light = coolorsToHex('https://coolors.co/f1f4f4-eaeaea-dfe1e3-cfd0d1-73777b');

// other palettes
// 0: AA on light[0] and on error[3]
// 1: AA on white
const error = coolorsToHex('https://coolors.co/b20e0e-c10f0f-d31717-f2e3e3-ffffff');
const success = coolorsToHex('https://coolors.co/00632e-007034-007c3a-e1f2ed-ffffff');

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

  // taxonomy/category colours
  // [0: default, 1: Human Rights Body, 2: UN session, 3: Human right, 4: Affected persons, 5: Thematic cluster, 6: Organisation, 7: SDGs, 8: State, 9: SMART]
  taxonomies: [
    '#8D95A0', // default, not used
    '#560950', // 1: Human Rights Body
    '#560950', // 2: Reporting Cycle
    '#73018E', // 3: Recommending State
    '#BA4692', // 4: Human right
    '#9B2727', // 5: Affected persons
    '#FDB980', // 6: Thematic cluster
    '#EAEAEA', // 7: Organisation
    '#BA5D03', // 8: SMART
    '#73777B', // 9: Progress status
    '#FFDDC1', // 10:
    '#1E1F1F',
  ],
  taxonomiesHover: [
    '#656F75', // default, not used
    '#0B000B', // 1: Human Rights Body
    '#0B000B', // 2: Reporting Cycle
    '#510064', // 3: Recommending State
    '#98226F', // 4: Human right
    '#6F0B0B', // 5: Affected persons
    '#F09F5B', // 6: Thematic cluster
    '#DBD8D8', // 7: Organisation
    '#964B00', // 8: SMART
    '#5F6367', // 9: Progress status
    '#F7BF8E',
    '#000000',
  ],
  taxonomiesTextColor: [
    primary[4], // default, not used
    primary[4], // 1: Human Rights Body
    primary[4], // 2: Reporting Cycle
    primary[4], // 3: Recommending State
    primary[4], // 4: Human right
    primary[4], // 5: Affected persons
    dark[0], // 6: Thematic cluster
    dark[0], // 7: Organisation
    primary[4], // 8: SMART
    primary[4], // 9: Progress status
    primary[4],
    primary[4],
  ],
  // bg inactive, bg hover, icon
  smartInactive: [
    '#DBE1E1', // SMART inactive - NOT ACCESSIBLE
    '#CFD0D1', // SMART inactive hover
    '#9BABAB', // SMART icon
  ],

  // other entities
  // [aqll #AA compliant]
  // maybe [#AA-Large compliant] 18pt/24px or 14pt/19px bold can suffice with AA com,pliant hover if agreed by customer
  measuresHover: ['#964B00'], // FFC107  AA compliant
  measures: ['#BA5D03'],
  recommendationsHover: ['#510064', 'transparent'], // accepted, noted ['#FF9B69', '#FFB28B'],
  recommendations: ['#73018E', 'transparent'],
  indicatorsHover: ['#F09F5B'],
  indicators: ['#FFCEA5'],
  reportsHover: [error[1]],
  reports: [error[0]],
  attributesHover: [dark[2]],
  attributes: [dark[3]],
  rolesHover: [dark[2]],
  roles: [dark[3]],

  //
  // UI PALETTES //////////////////////////////////////////////////////////////
  //

  // main background
  mainBackground: ['#f2f3f4'],
  // text
  // [#primaryFont, #secondaryFont, #inverse]
  text: [dark[0], dark[1], primary[4]],
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
  headerNavPages: [secondary[2]],
  // headerNavPagesItem: [ '#color', '#colorActive', '#bg', '#bgActive' ],
  headerNavPagesItem: [dark[0], secondary[0], 'transparent', 'transparent'],
  headerNavPagesItemHover: [dark[0], secondary[0], 'transparent', 'transparent'],

  // headerNavAccount: [ '#bg' ],
  headerNavAccount: ['transparent'],
  // headerNavAccountItem: ['#color', '#colorActive', '#bg', '#bgActive', '#border' ]
  headerNavAccountItem: [secondary[4], secondary[4], dark[0], secondary[0], dark[0]],
  headerNavAccountItemHover: [secondary[4], secondary[4], 'black', 'black', dark[0]],

  // headerNavMain: [ '#bg', '#border'  ],
  headerNavMain: [secondary[4], secondary[4]],
  // headerNavMainItem: ['#color', '#colorActive', '#bg', '#bgActive'],
  headerNavMainItem: [dark[3], primary[1], 'transparent', dark[2]],
  headerNavMainItemHover: [primary[1], primary[1], 'transparent', dark[1]],

  //
  // SIDEBAR "PALETTES" //////////////////////////////////////////////////////////////
  //
  // aside: ['#bg']
  aside: [primary[4]],
  // asideHeader: ['#bg']
  asideHeader: [primary[4]],

  // CATEGORY SIDEBAR "PALETTES" //////////////////////////////////////////////////////////////
  // asideCatNavItem: ['#color', '#colorActive', '#bg', '#bgActive', '#border'],
  asideCatNavItem: [dark[0], primary[4], primary[4], primary[2], light[0]],
  asideCatNavItemHover: [primary[4], primary[4], light[0], primary[2], light[0]],

  // ENTITYLIST SIDEBAR "PALETTES" //////////////////////////////////////////////////////////////
  // asideCatNavItem: ['#color', '#active', '#bg', '#bgactive', '#border'],
  asideListItem: [dark[0], dark[0], primary[4], light[0], light[0]],
  asideListItemHover: [dark[0], dark[0], light[2], light[2], light[0]],

  // asideHeader: [#color, '#bg',]
  asideListGroup: [dark[1], light[0]],
  asideListGroupHover: [dark[1], light[0]],

  // mainListHeader
  mainListHeader: [dark[0], '#E5E7E8'],

  // mainListItem: [#color, '#bg',], eg category and entity list items
  mainListItem: [dark[0], primary[4]],
  mainListItemHover: [dark[1], primary[4]],

  // multiselect header [#color, #bg]
  // compare asideListItem
  multiSelectHeader: [dark[1], light[0]],
  multiSelectFieldButton: [dark[0], light[1]],
  multiSelectFieldButtonHover: [dark[0], light[2]],
  //
  // BUTTONS / LINKS
  //
  // button: ['#colorPrimary', '#colorSecondary', #disabled],
  buttonFlat: [primary[1], dark[1], light[4]], // aka ghost button
  buttonFlatHover: [primary[0], primary[1]],
  buttonCancel: [dark[3]], // form footer cancel
  buttonCancelHover: [primary[1]],
  // buttonDefault: ['#text', '#bg'],
  buttonDefault: [primary[4], primary[0]], // with background
  buttonDefaultHover: [primary[4], primary[0]],
  buttonDefaultDisabled: [light[0], dark[3]], // with background disabled
  // buttonPrimary: ['#text', '#bg', '#border'],
  buttonDefaultIconOnly: [primary[4], primary[0], primary[2]], // with background, without text
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

  // checkbox
  checkbox: [dark[2]],
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
    mainListItem: '20px',
    nestedListItem: '16px',
    listItemTop: '13px',
    listItemBottom: '12px',
    markdown: '18px',
    markdownMobile: '16px',
    small: '14px', // used for labels
    smaller: '12px', // used for labels
    smallMobile: '11px', // used for labels
    default: '16px', // used for labels
  },
  print: {
    aaLargeBold: '14pt',
    aaLarge: '18pt',
    mainListItem: '15pt',
    nestedListItem: '12pt',
    listItemTop: '10pt',
    listItemBottom: '9pt',
    markdown: '14pt',
    markdownMobile: '12pt',
    smallest: '7pt', // used for labels
    smaller: '8pt', // used for labels
    small: '9pt', // used for labels
    default: '10pt', // used for labels
    large: '11pt', // used for labels
    larger: '12pt', // used for labels
    largest: '14pt', // used for labels
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
    paddingTop: 12,
    paddingBottom: 12,
  },
  header: {
    banner: {
      height: 88,
      heightMobile: 50,
    },
    nav: {
      height: 50,
      heightMobile: 32,
    },
    // px or em
    text: {
      title: '2.2em',
      titleMobile: '1em',
      claim: '0.85em',
      claimMobile: '1em',
    },
    print: {
      title: '14pt',
      claim: '9pt',
    },
    paddingLeft: {
      mobile: 3,
      small: 6,
      large: 10,
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
    print: {
      title: '2.8em',
      claim: '1em',
    },
  },
};

theme.text = {
  xxxlarge: { size: '48px', height: '60px', maxWidth: '800px' },
  xxlarge: { size: '30px', height: '36px', maxWidth: '800px' },
  xlarge: { size: '20px', height: '28px', maxWidth: '800px' },
  large: { size: '18px', height: '24px', maxWidth: '800px' },
  largeTall: { size: '18px', height: '26px', maxWidth: '800px' },
  medium: { size: '16px', height: '21px', maxWidth: '800px' },
  mediumTall: { size: '16px', height: '23px', maxWidth: '800px' },
  mediumTight: { size: '16px', height: '18px', maxWidth: '800px' },
  small: { size: '14px', height: '18px', maxWidth: '700px' },
  xsmall: { size: '13px', height: '16px', maxWidth: '600px' },
  xxsmall: { size: '12px', height: '14px', maxWidth: '500px' },
  xxxsmall: { size: '11px', height: '13px', maxWidth: '500px' },
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

// grommet
theme.global = {
  drop: {
    zIndex: 200,
  },
  font: {
    size: '16px',
    height: 1.42857,
  },
  breakpoints: {
    small: {
      value: BREAKPOINTS.small.max,
    },
    medium: {
      value: BREAKPOINTS.medium.max,
    },
    large: {
      value: BREAKPOINTS.large.max,
    },
    xlarge: {},
  },
  colors: {
    aHover: '#08586c',
  },
  edgeSize: {
    hair: '1px',
    xxsmall: '3px',
    xsmall: '6px',
    small: '12px',
    ms: '16px',
    medium: '24px',
    ml: '36px',
    large: '48px',
    xlarge: '64px',
    xxlarge: '100px',
  },
};

theme.layer = {
  zIndex: 201,
  overlay: {
    background: 'rgba(0, 0, 0, 0.80)',
  },
};

theme.text = {
  xxxlarge: { size: '48px', height: '60px', maxWidth: '800px' },
  xxlarge: { size: '30px', height: '36px', maxWidth: '800px' },
  xlarge: { size: '20px', height: '28px', maxWidth: '800px' },
  large: { size: '18px', height: '24px', maxWidth: '800px' },
  largeTall: { size: '18px', height: '26px', maxWidth: '800px' },
  medium: { size: '16px', height: '21px', maxWidth: '800px' },
  mediumTall: { size: '16px', height: '23px', maxWidth: '800px' },
  mediumTight: { size: '16px', height: '18px', maxWidth: '800px' },
  small: { size: '14px', height: '18px', maxWidth: '700px' },
  xsmall: { size: '13px', height: '16px', maxWidth: '600px' },
  xxsmall: { size: '12px', height: '14px', maxWidth: '500px' },
  xxxsmall: { size: '11px', height: '13px', maxWidth: '500px' },
};

theme.icon = {
  size: {
    xxsmall: '14px',
    xsmall: '20px',
    small: '24px',
    medium: '36px',
    large: '48px',
    xlarge: '96px',
  },
};

export default theme;
