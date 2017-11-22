/*
 *
 * ReportNew constants
 *
 */
import { fromJS } from 'immutable';

export const SAVE = 'impactoss/ReportNew/SAVE';

export const FORM_INITIAL = fromJS({
  attributes: {
    draft: true,
    title: '',
    description: '',
    document_url: '',
    document_public: true,
    due_date_id: '0',
  },
});

export const DEPENDENCIES = [
  'user_roles',
  'indicators',
  'due_dates',
  'progress_reports',
];
