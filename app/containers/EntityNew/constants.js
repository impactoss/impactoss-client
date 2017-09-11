
import { fromJS } from 'immutable';

export const FORM_INITIAL = fromJS({
  attributes: {
    draft: true,
    accepted: true,
    title: '',
    reference: '',
    response: '',
    short_title: '',
    description: '',
    url: '',
    taxonomy_id: '',
    manager_id: '',
    user_only: false,
    target_date: '',
    outcome: '',
    indicator_summary: '',
    target_date_comment: '',
    frequency_months: '',
    repeat: '',
    start_date: '',
    end_date: '',
    indicator_id: '',
    due_date_id: '',
    document_url: '',
    document_public: true,
  },
});
