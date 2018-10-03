/**
*
* Icons definition file used by Icon component (/components/Icon)
*
* for each icon one or more SVG-paths are required and optionally also the viewport size (defaults to 24px)
* iconName: {
*   size: 24,
*   paths: ['s v g', 'p a t h s'],
* }
*
* when omitting the size, the paths can also be given:
* iconName: {
*   paths: ['s v g', 'p a t h s'],
* }
* can be given as
* iconName: ['s v g', 'p a t h s'],
*
*
*
*/

const icons = {
  menu: {
    size: 30,
    paths: [
      'M4 7h22M4 15h22M4 23h22',
    ],
  },
  placeholder: {
    size: 24,
    paths: [
      'M4,4V20H20V4ZM18.29,5,12,11.29,5.71,5ZM5,5.71,11.29,12,5,18.29ZM5.71,19,12,12.71,18.29,19ZM19,18.29,12.71,12,19,5.71Z',
    ],
  },
  // Taxonomies
  // 1: Human Rights Body
  taxonomy_1: {
    size: 40,
    paths: [
      'M32,19H25.33l.29-3.8A1.43,1.43,0,0,1,27.08,14h3.16a1.43,1.43,0,0,1,1.47,1.2Zm-3.34-6a2,2,0,1,0-2-2A2,2,0,0,0,28.66,13Zm-7.08,1H18.42A1.43,1.43,0,0,0,17,15.2L16.66,19h6.67L23,15.2A1.43,1.43,0,0,0,21.58,14Z',
      'M20,13a2,2,0,1,0-2-2A2,2,0,0,0,20,13Zm-7.08,1H9.75a1.43,1.43,0,0,0-1.47,1.2L8,19h6.67l-.29-3.8A1.43,1.43,0,0,0,12.92,14Zm-1.58-1a2,2,0,1,0-2-2A2,2,0,0,0,11.34,13Z',
      'M4,20v2H5v7s2,3,15,3,15-3,15-3V22h1V20Z',
    ],
  },
  // 2: UN session
  taxonomy_2: {
    size: 40,
    paths: [
      'M32.5,20A12.51,12.51,0,0,1,22,32.32V36l-8-5,8-5v3.28A9.49,9.49,0,0,0,25,12l2-1.26.73-.46A12.48,12.48,0,0,1,32.5,20Zm-22,0A9.51,9.51,0,0,1,18,10.72V14l8-5L18,4V7.68a12.48,12.48,0,0,0-5.79,22.08l.73-.46L15,28A9.49,9.49,0,0,1,10.5,20Z',
    ],
  },
  // 3: Thematic cluster
  taxonomy_3: {
    size: 40,
    paths: [
      'M36,20a3,3,0,0,1-5.82,1H24.9a5,5,0,0,1-1.59,2.73L26,28.32a3,3,0,1,1-1.73,1l-2.66-4.6a4.54,4.54,0,0,1-3.14,0l-2.66,4.6a3,3,0,1,1-1.73-1l2.65-4.59A5,5,0,0,1,15.1,21H9.82a3,3,0,1,1,0-2H15.1a5,5,0,0,1,1.59-2.73L14,11.68a3,3,0,1,1,1.73-1l2.66,4.6a4.54,4.54,0,0,1,3.14,0l2.66-4.6a3,3,0,1,1,1.73,1l-2.65,4.59A5,5,0,0,1,24.9,19h5.28A3,3,0,0,1,36,20Z',
    ],
  },
  // 4: Organisation
  taxonomy_4: {
    size: 40,
    paths: [
      'M26.5,19h5L34,15l-2.5-4h-5L24,15Zm-18,0h5L16,15l-2.5-4h-5L6,15Zm18,10h5L34,25l-2.5-4h-5L24,25Zm-18,0h5L16,25l-2.5-4h-5L6,25Zm9,5h5L25,30l-2.5-4h-5L15,30Zm0-20h5L25,10,22.5,6h-5L15,10Z',
    ],
  },
  // 5: Human rights issue
  taxonomy_5: {
    size: 40,
    paths: [
      'M17,11h4V21H17Zm2,12a2,2,0,1,0,2,2A2,2,0,0,0,19,23Zm12.62,5.38-.71.71-2.15-2.15-3,2.69,1.94,1.94,1.41-1.41.71.71L27.73,33l5.15,5.15,4.24-4.24Z',
      'M33,19A14,14,0,1,0,19,33,14,14,0,0,0,33,19Zm-3,0A11,11,0,1,1,19,8,11,11,0,0,1,30,19Z',
    ],
  },
  // 6: Human right
  taxonomy_6: {
    size: 40,
    paths: [
      'M19.49,4.38a5.39,5.39,0,0,1,2.86,4.48c0,2.35-3.78,9.36-2.32,11.18l9.4-11.72s2.34,2.85.94,5.25-5.06,5.43-6.5,7.61c-.89,1.35-.46,2.07-.46,2.07L34.81,17a4.6,4.6,0,0,1-1.26,4.67c-2.28,2.06-7.67,2.88-7.67,5H33.7s-.8,2.37-2.31,2.7c-1.33.3-4.19-.48-5.53.73s-3,5.48-7.78,5.48c-3.21,0-5.69-2.31-7.24-5.34C9.06,26.77,7.06,25.08,5,24.65A4.57,4.57,0,0,1,9.08,22c4.06,0,5.8,6.66,8.87,6.66a1.67,1.67,0,0,0,1.82-1.76c0-1.42-2-2.59-2.6-3a4.17,4.17,0,0,1-1.74-5L19.49,4.38',
    ],
  },
  // 7: Affected persons
  taxonomy_7: {
    size: 40,
    paths: [
      'M15,10a2.5,2.5,0,1,0-2.5-2.5A2.5,2.5,0,0,0,15,10Zm10,0a2.5,2.5,0,1,0-2.5-2.5A2.5,2.5,0,0,0,25,10Z',
      'M24,24.9A1,1,0,0,1,23,26h-.8l-.56,7.93A1.15,1.15,0,0,1,20.47,35h-.95a1.15,1.15,0,0,1-1.15-1.07L17.82,26H17a1,1,0,0,1-1-1.1l.51-7.4A1.68,1.68,0,0,1,18.19,16h3.61a1.68,1.68,0,0,1,1.68,1.5Z',
      'M20,15a2.5,2.5,0,1,0-2.5-2.5A2.5,2.5,0,0,0,20,15Zm-6,9.9A1,1,0,0,1,13,26h-.8l-.56,7.93A1.15,1.15,0,0,1,10.47,35H9.53a1.15,1.15,0,0,1-1.15-1.07L7.82,26H7a1,1,0,0,1-1-1.1l.51-7.4A1.68,1.68,0,0,1,8.19,16h3.61a1.68,1.68,0,0,1,1.68,1.5Z',
      'M10,15a2.5,2.5,0,1,0-2.5-2.5A2.5,2.5,0,0,0,10,15Zm24,9.9A1,1,0,0,1,33,26h-.8l-.56,7.93A1.15,1.15,0,0,1,30.47,35h-.95a1.15,1.15,0,0,1-1.15-1.07L27.82,26H27a1,1,0,0,1-1-1.1l.51-7.4A1.68,1.68,0,0,1,28.19,16h3.61a1.68,1.68,0,0,1,1.68,1.5Z',
      'M30,15a2.5,2.5,0,1,0-2.5-2.5A2.5,2.5,0,0,0,30,15Z',
    ],
  },
  // 8: sdgs
  taxonomy_8: {
    size: 40,
    paths: [
      'M24,11.57l2.41-6.24a15.86,15.86,0,0,1,3.9,2.43l-4.5,4.94A9.15,9.15,0,0,0,24,11.57Zm1.17-6.72A15.67,15.67,0,0,0,20.67,4v6.69a9.16,9.16,0,0,1,2.1.38Z',
      'M36,19.26l-6.65.62V20a9.33,9.33,0,0,1-.21,2l6.42,1.83A16,16,0,0,0,36,20C36,19.75,36,19.5,36,19.26Z',
      'M19.33,10.69V4a15.67,15.67,0,0,0-4.51.85l2.41,6.22A9.16,9.16,0,0,1,19.33,10.69Zm8.74,4.62,6-3A16.23,16.23,0,0,0,31.3,8.66L26.8,13.6A9.73,9.73,0,0,1,28.07,15.31Zm1.14,3.24,6.65-.62a15.43,15.43,0,0,0-1.22-4.4l-6,3A8.66,8.66,0,0,1,29.21,18.55Zm-16-5L8.7,8.66A16.23,16.23,0,0,0,6,12.33l6,3A9.73,9.73,0,0,1,13.2,13.6Z',
      'M12.19,34a15.66,15.66,0,0,0,4.24,1.63L17.65,29a9.26,9.26,0,0,1-1.94-.74Zm-.93-10.71L4.83,25.09a16.14,16.14,0,0,0,2.05,4.06l5.33-4A9.47,9.47,0,0,1,11.26,23.25Z',
      'M13,26.18l-5.33,4a16.33,16.33,0,0,0,3.37,3.05l3.51-5.69A10.27,10.27,0,0,1,13,26.18Z',
      'M10.67,20v-.11L4,19.26c0,.24,0,.49,0,.73a16,16,0,0,0,.46,3.82L10.88,22A9.33,9.33,0,0,1,10.67,20Zm11.68,9,1.22,6.57A15.66,15.66,0,0,0,27.81,34l-3.52-5.68A9.26,9.26,0,0,1,22.35,29Zm3.08-1.44,3.51,5.69a16.33,16.33,0,0,0,3.37-3.05l-5.33-4A10.27,10.27,0,0,1,25.43,27.58Z',
      'M11.35,16.51l-6-3a15.43,15.43,0,0,0-1.22,4.4l6.65.62A8.66,8.66,0,0,1,11.35,16.51Zm16.44,8.62,5.33,4a16.14,16.14,0,0,0,2.05-4.06l-6.43-1.84A9.47,9.47,0,0,1,27.79,25.13Z',
      'M20,29.33a8.94,8.94,0,0,1-1-.06l-1.22,6.57a16,16,0,0,0,4.52,0L21,29.27A8.94,8.94,0,0,1,20,29.33Z',
      'M16,11.57,13.58,5.33a15.86,15.86,0,0,0-3.9,2.43l4.5,4.94A9.15,9.15,0,0,1,16,11.57Z',
    ],
  },
  // 9: SMART
  taxonomy_9: {
    size: 40,
    paths: [
      'M18,17h9v2H18Zm0,7h9V22H18Zm0,5h9V27H18Z',
      'M31,9V34H9V9h4V8h4V6.91A.91.91,0,0,1,17.91,6h4.18a.91.91,0,0,1,.91.91V8h4V9Zm-2,2H27v1H13V11H11V32H29Z',
      'M14.23,18.17l-1-.73-.59.81,1.75,1.27,2.61-3-.75-.65Zm0,5.34-1-.73-.59.81,1.75,1.27,2.61-3-.75-.66Zm0,4.88-1-.73-.59.81,1.75,1.27,2.61-3-.75-.65Z',
    ],
  },
  // 10: Progress status
  taxonomy_10: {
    size: 40,
    paths: [
      'M15.31,9.5,14.09,6.76a14.68,14.68,0,0,0-3.27,2l1.91,2.32A11.2,11.2,0,0,1,15.31,9.5Z',
      'M14.53,20.54l2.54,2.54,8.9-8.9,2.12,2.12-11,11-4.66-4.66Z',
      'M20,5.5a14.78,14.78,0,0,0-2.22.17l.45,3A13.05,13.05,0,0,1,20,8.5a11.5,11.5,0,1,1-9.54,17.93,11.69,11.69,0,0,1-.87-1.54L6.88,26.17A13.8,13.8,0,0,0,8,28.11,14.5,14.5,0,1,0,20,5.5Z',
      'M8.5,20c0-.35,0-.7.05-1l-3-.27c0,.43-.06.87-.06,1.31a14,14,0,0,0,.22,2.51l3-.51A12.18,12.18,0,0,1,8.5,20Z',
      'M10.64,13.31,8.2,11.56A15.1,15.1,0,0,0,6.4,15l2.82,1A11.48,11.48,0,0,1,10.64,13.31Z',
    ],
  },
  // Icons

  // Icons 40px
  ticklLarge: {
    size: 24,
    paths: [
      'M16.4,30.75,7.92,22.27l2.83-2.83L16.4,25.1,31.25,10.25l2.83,2.83Z',
    ],
  },
  error: {
    size: 24,
    paths: [
      'M22,24H18L17,6h6Zm-2,3a3,3,0,1,0,3,3A3,3,0,0,0,20,27Z',
    ],
  },

  // Icons 24px
  measures: {
    size: 24,
    paths: [
      'M5,3H19l-4.76,8h8L9,24.09V15H5Z',
    ],
  },
  indicators: {
    size: 24,
    paths: [
      'M5,4H8V21H5Z',
      'M9,21h3V8H9Zm4,0h3V14H13Zm4-10V21h3V11Z',
    ],
  },
  recommendations: {
    size: 24,
    paths: [
      'M18,4H6A4,4,0,0,0,2,8v7a4,4,0,0,0,4,4v5l6-5h6a4,4,0,0,0,4-4V8A4,4,0,0,0,18,4Z',
    ],
  },
  categories: {
    size: 24,
    paths: [
      'M19,4.08l-6.82.75a1.48,1.48,0,0,0-.88.42L3.43,13.11a1.48,1.48,0,0,0,0,2.09L9.8,21.57a1.48,1.48,0,0,0,2.09,0l7.85-7.85a1.48,1.48,0,0,0,.42-.88L20.92,6A1.75,1.75,0,0,0,19,4.08Z',
      'M17.83,9.29a1.5,1.5,0,1,1,0-2.12A1.5,1.5,0,0,1,17.83,9.29Z',
    ],
  },
  connectedCategories: {
    size: 24,
    paths: [
      'M16.77,6.73a1.5,1.5,0,1,0,1.06.44A1.49,1.49,0,0,0,16.77,6.73Zm2.41-2.66H19l-6.82.75a1.48,1.48,0,0,0-.88.42L3.43,13.11a1.48,1.48,0,0,0,0,2.09L9.8,21.57a1.48,1.48,0,0,0,2.09,0l7.85-7.85a1.48,1.48,0,0,0,.42-.88L20.92,6A1.75,1.75,0,0,0,19.18,4.07Zm0,8.65A.48.48,0,0,1,19,13l-7.85,7.85a.48.48,0,0,1-.68,0L4.14,14.49a.48.48,0,0,1,0-.68L12,6a.48.48,0,0,1,.29-.14l6.82-.75h.09a.75.75,0,0,1,.74.83Z',
    ],
  },
  sdgtargets: {
    size: 24,
    paths: [
      'M14.63,6.47l1.59-4.1A10.53,10.53,0,0,1,18.77,4L15.82,7.21A6.07,6.07,0,0,0,14.63,6.47Zm.77-4.41a10.08,10.08,0,0,0-3-.56V5.89a5.79,5.79,0,0,1,1.38.25Zm7.09,9.46-4.37.4V12A6.26,6.26,0,0,1,18,13.3l4.22,1.2A10.85,10.85,0,0,0,22.5,12C22.5,11.83,22.49,11.67,22.49,11.52Z',
      'M11.56,5.89V1.5a10.08,10.08,0,0,0-3,.56l1.58,4.08A5.79,5.79,0,0,1,11.56,5.89Zm5.73,3L21.22,7a10.38,10.38,0,0,0-1.8-2.41l-3,3.24A6,6,0,0,1,17.29,8.92Z',
      'M18,11.05l4.37-.41a10.5,10.5,0,0,0-.8-2.89l-3.93,2A5.88,5.88,0,0,1,18,11.05Z',
      'M7.54,7.8l-3-3.24A10.38,10.38,0,0,0,2.78,7l3.93,2A6,6,0,0,1,7.54,7.8Z',
      'M6.88,21.16a10,10,0,0,0,2.78,1.07l.8-4.31a6.38,6.38,0,0,1-1.28-.49Zm-.61-7-4.22,1.2A10.45,10.45,0,0,0,3.39,18l3.5-2.65A6.09,6.09,0,0,1,6.27,14.14Zm1.15,1.92L3.92,18.7a10.56,10.56,0,0,0,2.21,2L8.44,17A6.27,6.27,0,0,1,7.42,16.06Z',
      'M5.88,12v-.07l-4.37-.4c0,.15,0,.31,0,.47a10.85,10.85,0,0,0,.3,2.51L6,13.3A6.26,6.26,0,0,1,5.88,12Zm7.66,5.93.8,4.31a10,10,0,0,0,2.78-1.07l-2.3-3.73A6.38,6.38,0,0,1,13.54,17.92Zm2-1,2.31,3.74a10.56,10.56,0,0,0,2.21-2l-3.5-2.64A6.27,6.27,0,0,1,15.56,17Z',
      'M6.32,9.71l-3.93-2a10.5,10.5,0,0,0-.8,2.89L6,11.05A5.88,5.88,0,0,1,6.32,9.71Zm10.79,5.65L20.61,18A10.45,10.45,0,0,0,22,15.34l-4.22-1.2A6.09,6.09,0,0,1,17.11,15.36Z',
      'M12,18.12a5.07,5.07,0,0,1-.68,0l-.8,4.31a10,10,0,0,0,3,0l-.8-4.31A5.07,5.07,0,0,1,12,18.12Z',
      'M9.37,6.47,7.78,2.37A10.53,10.53,0,0,0,5.23,4L8.18,7.21A6.07,6.07,0,0,1,9.37,6.47Z',
    ],
  },
  calendar: {
    size: 24,
    paths: [
      'M15,11h4v3H15Zm0,4h4v3H15Zm-5-4h4v3H10Zm0,4h4v3H10ZM5,11H9v3H5Zm0,4H9v3H5Zm4-1H5V11H9Zm5,0H10V11h4Zm5,0H15V11h4ZM9,18H5V15H9Zm5,0H10V15h4Zm5,0H15V15h4ZM20,4H18V6H17V2H15V4H9V6H8V2H6V4H4A2,2,0,0,0,2,6V22H22V6A2,2,0,0,0,20,4Zm0,16H4V9H20Z',
    ],
  },
  reminder: {
    size: 24,
    paths: [
      'M13,6v5h3v2H11V6Zm8.95,5h-2A8,8,0,1,1,12,4a7.89,7.89,0,0,1,4.84,1.66l-.2.2L15,7.5,21.5,9,20,2.5,18.27,4.23A10,10,0,1,0,22,12C22,11.66,22,11.33,21.95,11Z',
    ],
  },
  report: {
    size: 24,
    paths: [
      'M18.71,6.7,15.29,3.29A1,1,0,0,0,14.59,3H6A1,1,0,0,0,5,4V20a1,1,0,0,0,1,1H18a1,1,0,0,0,1-1V7.41A1,1,0,0,0,18.71,6.7ZM17,19H7V5h6V9h4ZM8,11h8v1H8Zm0,2h8v1H8Zm0,2h4v1H8Z',
    ],
  },
  recommendationAccepted: {
    size: 24,
    paths: [
      'M18,4H6A4,4,0,0,0,2,8v7a4,4,0,0,0,4,4v5l6-5h6a4,4,0,0,0,4-4V8A4,4,0,0,0,18,4ZM10,16.06,6.29,12.35l1.42-1.41L10,13.23l6.29-6.29,1.42,1.41Z',
    ],
  },
  recommendationNoted: {
    size: 24,
    paths: [
      'M18,4H6A4,4,0,0,0,2,8v7a4,4,0,0,0,4,4v5l6-5h6a4,4,0,0,0,4-4V8A4,4,0,0,0,18,4ZM16.71,14.79l-1.42,1.42L12,12.91l-3.29,3.3L7.29,14.79l3.3-3.29L7.29,8.21,8.71,6.79,12,10.09l3.29-3.3,1.42,1.42-3.3,3.29Z',
    ],
  },
  attributes: {
    size: 24,
    paths: [
      'M12,3a9,9,0,1,0,9,9A9,9,0,0,0,12,3Zm5,10H13v4H11V13H7V11h4V7h2v4h4Z',
    ],
  },
  connections: {
    size: 24,
    paths: [
      'M8.5,5.5a3,3,0,0,1,6,0h0a3,3,0,1,1-6,0Zm-4,10a3,3,0,1,0,3,3h0A3,3,0,0,0,4.5,15.5Zm10.1,2H9.4a5,5,0,0,1,0,2h5.2a5,5,0,0,1,0-2Zm4.9-2a3,3,0,1,0,3,3h0A3,3,0,0,0,19.5,15.5Z',
      'M8.31,9.32,5.93,13.73a5,5,0,0,1,1.76.95l2.38-4.42A5,5,0,0,1,8.31,9.32Zm6.6-.18a5,5,0,0,1-1.71,1l2.88,4.68a5,5,0,0,1,1.71-1Z',
    ],
  },
  search: {
    size: 24,
    paths: [
      'M23.06,20.94l-4.73-4.73a9,9,0,1,0-2.12,2.12l4.73,4.73ZM11,17a6,6,0,1,1,6-6A6,6,0,0,1,11,17Z',
    ],
  },
  download: {
    size: 24,
    paths: [
      'M20,16v4H4V16H6v2H18V16ZM9,12l3,4,3-4H13V4H11v8Z',
    ],
  },
  columnExpand: {
    size: 24,
    paths: [
      'M11,11v2H5v2L1,12,5,9v2Zm12,1L19,9v2H13v2h6v2Z',
    ],
  },
  columnCollapse: {
    size: 24,
    path: [
      'M1,13V11H7V9l4,3L7,15V13Zm12-1,4,3V13h6V11H17V9Z',
    ],
  },
  tick: {
    size: 24,
    path: [
      'M18.86,8.38l-7.07,7.07-1.41,1.41L6.14,12.62l1.41-1.41L10.38,14,17.45,7Z',
    ],
  },

  // Icons 16px
  dropdownOpen: {
    size: 16,
    paths: [
      'M8,11.34,2.84,6.75l1.33-1.5L8,8.66l3.84-3.41,1.33,1.5Z',
    ],
  },
  dropdownClose: {
    size: 16,
    paths: [
      'M11.84,10.75,8,7.34,4.16,10.75,2.84,9.25,8,4.66l5.16,4.59Z',
    ],
  },
  removeSmall: {
    size: 16,
    paths: [
      'M12.95,4.46,9.41,8l3.54,3.54-1.41,1.41L8,9.41,4.46,12.95,3.05,11.54,6.59,8,3.05,4.46,4.46,3.05,8,6.59l3.54-3.54Z',
    ],
  },
  add: {
    size: 16,
    paths: [
      'M14,9H9v5H7V9H2V7H7V2H9V7h5Z',
    ],
  },
  info: {
    size: 16,
    paths: [
      'M7,6H9v7H7ZM8,5A1,1,0,1,0,7,4,1,1,0,0,0,8,5Z',
    ],
  },
  // Icons 32px
  trash: {
    size: 32,
    paths: [
      'M26,6V9H7V6ZM19,4H14V5h5ZM8,10H25L24,26.06a1,1,0,0,1-1.06.94H10.06A1,1,0,0,1,9,26.06ZM20.18,24h1l.65-11h-1ZM16,24h1V13H16ZM11.18,13l.65,11h1l-.65-11Z',
    ],
  },
  filter: {
    size: 32,
    paths: [
      'M28,7V9H12.9a5,5,0,0,0,0-2ZM8,5a3,3,0,1,0,3,3A3,3,0,0,0,8,5Zm13,8a3,3,0,1,0,3,3A3,3,0,0,0,21,13Zm5,3a5,5,0,0,1-.1,1H28V15H25.9A5,5,0,0,1,26,16Zm-9.9-1H5v2H16.1a5,5,0,0,1,0-2ZM19,24a5,5,0,0,1-.1,1H28V23H18.9A5,5,0,0,1,19,24ZM9.1,23H5v2H9.1a5,5,0,0,1,0-2ZM14,21a3,3,0,1,0,3,3A3,3,0,0,0,14,21Z',
    ],
  },
  edit: {
    size: 32,
    paths: [
      'M21,20l2-2V28H5V10H16l-2,2H7V26H21ZM22,7.43,25.57,11l-9.9,9.9-3.54-3.54Zm6.36.71-2.12,2.12L22.74,6.72,24.86,4.6ZM15,21.57l-4.6,1.06L11.43,18Z',
    ],
  },
  close: {
    size: 48,
    paths: [
      'M36,14.1,26.12,24,36,33.9,33.9,36,24,26.12,14.1,36,12,33.9l9.9-9.9L12,14.1,14.1,12l9.9,9.9L33.9,12Z',
    ],
  },
  removeLarge: {
    size: 32,
    paths: [
      'M23.78,9.64,17.41,16l6.36,6.36-1.41,1.41L16,17.41,9.64,23.78,8.22,22.36,14.59,16,8.22,9.64,9.64,8.22,16,14.59l6.36-6.36Z',
    ],
  },
  arrowDown: {
    size: 32,
    paths: [
      'M16,23.7,2.15,10.92l1.7-1.84L16,20.3,28.15,9.08l1.7,1.84Z',
    ],
  },
  arrowRight: {
    size: 32,
    paths: [
      'M10.92,29.85l-1.84-1.7L20.3,16,9.08,3.85l1.84-1.7L23.7,16Z',
    ],
  },
  arrowLeft: {
    size: 32,
    paths: [
      'M21.08,29.85,8.3,16,21.08,2.15l1.84,1.7L11.7,16,22.92,28.15Z',
    ],
  },
  sorting: {
    size: 24,
    paths: 'M9,17h2L8,21,5,17H7V5H9ZM16,3,13,7h2V19h2V7h2Z',
  },
  ascending: {
    size: 24,
    paths: [
      'M18,13H11v2h7Zm-2-3H11v2h5ZM14,7H11V9h3ZM8,21l3-4H9V5H7V17H5Z',
    ],
  },
  descending: {
    size: 24,
    paths: [
      'M18,7H11V9h7Zm-2,3H11v2h5Zm-2,3H11v2h3ZM8,21l3-4H9V5H7V17H5Z',
    ],
  },
  // s: specific
  smart_0: {
    size: 40,
    paths: [
      'M31,21l2-2V34H7V8H29l-2,2H9V32H31Z',
      'M14.81,16.49,11.27,20l8.49,8.49,17-17L33.19,8,19.76,21.43Z',
    ],
  },
  // m: measureable
  smart_1: {
    size: 40,
    paths: [
      'M33,32v2H6V32ZM14,18.45H9V30h5Zm8-5.25H17V30h5ZM30,8H25V30h5Z',
    ],
  },
  // a: assignable
  smart_2: {
    size: 40,
    paths: [
      'M34.09,6.91a4.5,4.5,0,1,0,0,6.36A4.49,4.49,0,0,0,34.09,6.91Zm-1.41,4.95a2.57,2.57,0,0,1-3.54,0,2.5,2.5,0,1,1,3.54,0Zm-15,5.28,8.56-2.33-2.33,8.56L21.45,21,14.3,28.11a4.5,4.5,0,1,1-1.41-1.41L20,19.55Z',
    ],
  },
  // r: result-oriented
  smart_3: {
    size: 40,
    paths: [
      'M33.52,14.55A14.86,14.86,0,0,1,35,21,15,15,0,1,1,20,6a14.86,14.86,0,0,1,6.45,1.48L25,9A13,13,0,1,0,32,16.05Z',
      'M20,14a7,7,0,0,1,2.34.41l1.53-1.52A8.8,8.8,0,0,0,20,12a9,9,0,1,0,9,9,8.8,8.8,0,0,0-.89-3.87l-1.52,1.53A7,7,0,1,1,20,14Zm.51,5.08a2,2,0,0,0-1.92.51,2,2,0,1,0,2.82,2.82,2,2,0,0,0,.51-1.92l7.36-7.35H31.5l4.55-4.55H32.41V5L27.86,9.5v2.22Z',
    ],
  },
  // t: time-bound
  smart_4: {
    size: 40,
    paths: [
      'M17,19h6v4H17Zm0,9h6V24H17Zm-7-5h6V19H10Zm0,5h6V24H10Zm14-5h6V19H24ZM32,8H30v2H29V7H27V8H14v2H13V7H11V8H8a2,2,0,0,0-2,2v3H34V10A2,2,0,0,0,32,8Z',
      'M24,28h6V24H24ZM6,14H34V33H6ZM8.09,31H31.91V16H8.09Z',
    ],
  },
};

export default icons;
