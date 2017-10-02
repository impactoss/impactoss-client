/*
 * ReportEdit Messages
 *
 * This contains all the text for the ReportEdit component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  pageTitle: {
    id: 'app.container.ReportEdit.pageTitle',
    defaultMessage: 'Edit Report',
  },
  pageTitleReference: {
    id: 'app.container.ReportEdit.pageTitleReference',
    defaultMessage: 'Edit Report for indicator {indicatorReference}',
  },
  metaDescription: {
    id: 'app.container.ReportEdit.metaDescription',
    defaultMessage: 'Edit Report page description',
  },
  header: {
    id: 'app.containers.ReportEdit.header',
    defaultMessage: 'Edit Report',
  },
  notFound: {
    id: 'app.containers.ReportEdit.notFound',
    defaultMessage: 'Sorry no report found',
  },
  loading: {
    id: 'app.containers.ReportEdit.loading',
    defaultMessage: 'Loading report...',
  },
  fieldRequired: {
    id: 'app.containers.ReportEdit.header',
    defaultMessage: 'Required',
  },
});
