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
      defaultMessage: 'infoline@hrc.co.nz',
    },
    anchor: {
      id: 'nmrf.components.Footer.contact.anchor',
      defaultMessage: 'infoline@hrc.co.nz',
    },
  },
  responsible: {
    text: {
      id: 'nmrf.components.Footer.responsible.text',
      defaultMessage: 'Visit our website to learn more about Human Rights in New Zealand',
    },
    url: {
      id: 'nmrf.components.Footer.responsible.url',
      defaultMessage: 'https://www.hrc.co.nz/',
    },
    anchor: {
      id: 'nmrf.components.Footer.responsible.anchor',
      defaultMessage: 'www.hrc.co.nz',
    },
    logo: {
      id: 'nmrf.components.Footer.responsible.logo',
      defaultMessage: 'Logo of the New Zealand Human Rights Commission',
    },
  },
  project: {
    text: {
      id: 'nmrf.components.Footer.project.text',
      defaultMessage: 'The New Zealand National Plan of Action website is powered by',
    },
    url: {
      id: 'nmrf.components.Footer.project.url',
      defaultMessage: 'http://impactoss.org',
    },
    anchor: {
      id: 'nmrf.components.Footer.project.anchor',
      defaultMessage: 'IMPACT OSS',
    },
  },
});
