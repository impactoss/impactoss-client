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
*/

const icons = {
  home: {
    size: 1024,
    paths: ['M1024 608l-192-192v-288h-128v160l-192-192-512 512v32h128v320h320v-192h128v192h320v-320h128z'],
  },
  actions: {
    size: 24,
    paths: [
      'M12,4.33A7.67,7.67,0,1,0,19.67,12,7.68,7.68,0,0,0,12,4.33ZM12,18a6,6,0,1,1,6-6A6,6,0,0,1,12,18Z',
      'M12,8.59A3.41,3.41,0,1,0,15.41,12,3.41,3.41,0,0,0,12,8.59Zm0,5.11A1.7,1.7,0,1,1,13.7,12,1.71,1.71,0,0,1,12,13.7Z',
    ],
  },
};

export default icons;
