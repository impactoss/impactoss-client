/*
 *
 * ReportEdit constants
 *
 */
import { fromJS } from 'immutable';

export const SAVE = 'nmrf/ReportEdit/SAVE';

export const DEPENDENCIES = [
  'user_roles',
  'progress_reports',
  'users',
  'due_dates',
  'indicators',
];

export const FORM_INITIAL = fromJS({
  id: '',
  attributes: {
    draft: '',
    title: '',
    description: '',
    document_url: '',
    document_public: '',
    due_date_id: '0',
    indicator_id: '',
  },
});
