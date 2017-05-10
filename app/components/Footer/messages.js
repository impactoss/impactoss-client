/*
 * HomePage Messages
 *
 * This contains all the text for the HomePage component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  disclaimer: {
    id: 'nmrf.components.Footer.disclaimer',
    defaultMessage: 'Every care has been taken to ensure the accuracy of this data and information. Please send any feedback to ',
  },
  contact: {
    email: {
      id: 'nmrf.components.Footer.contact.email',
      defaultMessage: 'contact@sadata.ws',
    },
    anchor: {
      id: 'nmrf.components.Footer.contact.anchor',
      defaultMessage: 'contact@sadata.ws',
    },
  },
  responsible: {
    text: {
      id: 'nmrf.components.Footer.responsible.text',
      defaultMessage: 'This website is brought to you by: this section could include links to sponsors',
    },
  },
  project: {
    text: {
      id: 'nmrf.components.Footer.project.text',
      defaultMessage: 'This website is an implementation of the NMRF open source project',
    },
    url: {
      id: 'nmrf.components.Footer.project.url',
      defaultMessage: 'https://github.com/dumparkltd/hr-nmrf-client',
    },
    anchor: {
      id: 'nmrf.components.Footer.project.anchor',
      defaultMessage: 'NMRF Open Source',
    },
  },
});
