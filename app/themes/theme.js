import coolorsToHex from 'coolors-to-hex'
import { reversePalette } from 'styled-theme/composer'

const theme = {}

// grid-styles settings https://github.com/jxnblk/grid-styled
theme.gutter = 20;
theme.breakpoints = {
  small: '32em',
  medium: '48em',
  large: '64em'
}




// styled-theme settings https://github.com/diegohaz/styled-theme

// color palettes
theme.palette = {
  primary: coolorsToHex('https://coolors.co/f7f7f2-e4e6c3-899878-222725-121113'),
  secondary: coolorsToHex('https://coolors.co/c2185b-e91e63-f06292-f48caf-f8bbd0'),
  danger: coolorsToHex('https://coolors.co/d32f2f-f44336-f8877f-f9a7a1-ffcdd2'),
  alert: coolorsToHex('https://coolors.co/ffa000-ffc107-ffd761-ffecb3-fff2ce'),
  success: coolorsToHex('https://coolors.co/388e3c-4caf50-7cc47f-9fd4a1-c8e6c9'),
  grayscale: ['#212121', '#616161', '#9e9e9e', '#bdbdbd', '#e0e0e0', '#ffffff']
}
theme.reversePalette = reversePalette(theme.palette)

// fonts
theme.fonts = {
  primary: 'Helvetica Neue, Helvetica, Roboto, sans-serif',
  pre: 'Consolas, Liberation Mono, Menlo, Courier, monospace',
  quote: 'Georgia, serif'
}

// sizes
theme.sizes = {}

// end styled-theme settings

// other global theme variables
// eg transitions
theme.transitions = {
  mouseOver : "0.2s"
}

export default theme
