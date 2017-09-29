/*
 * ReportNew Messages
 *
 * This contains all the text for the ReportNew component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  pageTitle: {
    id: 'app.container.ReportNew.pageTitle',
    defaultMessage: 'New Report',
  },
  metaDescription: {
    id: 'app.container.ReportNew.metaDescription',
    defaultMessage: 'New Report page description',
  },
  header: {
    id: 'app.containers.ReportNew.header',
    defaultMessage: 'New Report',
  },
  loading: {
    id: 'app.containers.ActionEdit.loading',
    defaultMessage: 'Loading data...',
  },
  fieldRequired: {
    id: 'app.containers.ReportNew.header',
    defaultMessage: 'Required',
  },
  fields: {
    title: {
      placeholder: {
        id: 'app.containers.ReportNew.fields.title.placeholder',
        defaultMessage: 'Enter report title',
      },
    },
  },
  guestNote: {
    id: 'app.containers.ReportNew.guestNote',
    defaultMessage: 'Please note: you are contributing as a guest user. Your report will only be publicly available once verified and published by an authorised user.',
  },
});
