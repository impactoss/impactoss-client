/*
 * ReportNew Messages
 *
 * This contains all the text for the ReportNew component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  pageTitle: {
    id: 'app.containers.ReportNew.pageTitle',
    defaultMessage: 'New Report for indicator {indicatorReference}',
  },
  metaDescription: {
    id: 'app.containers.ReportNew.metaDescription',
    defaultMessage: 'New Report page description',
  },
  header: {
    id: 'app.containers.ReportNew.header',
    defaultMessage: 'New Report',
  },
  guestNote: {
    id: 'app.containers.ReportNew.guestNote',
    defaultMessage: 'Please note: you are contributing as a guest user. Your report will only be publicly available once verified and published by an authorised user.',
  },
});
