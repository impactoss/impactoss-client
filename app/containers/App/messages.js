/*
 * Global Messages
 *
 * This contains the global text.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  app: {
    title: {
      id: 'app.containers.App.app.title',
      defaultMessage: 'Sadata',
    },
    claim: {
      id: 'app.containers.App.app.claim',
      defaultMessage: 'Samoa\'s home of human rights implementation',
    },
  },
  buttons: {
    cancel: {
      id: 'app.containers.App.buttons.cancel',
      defaultMessage: 'Cancel',
    },
    close: {
      id: 'app.containers.App.buttons.close',
      defaultMessage: 'Close',
    },
    add: {
      id: 'app.containers.App.buttons.add',
      defaultMessage: 'Add',
    },
    edit: {
      id: 'app.containers.App.buttons.edit',
      defaultMessage: 'Edit',
    },
    assign: {
      id: 'app.containers.App.buttons.assign',
      defaultMessage: 'Assign',
    },
  },
  forms: {
    fieldRequired: {
      id: 'app.containers.App.forms.fieldRequired',
      defaultMessage: 'This field cannot be empty',
    },
  },
  attributes: {
    draft: {
      id: 'app.containers.App.attributes.draft',
      defaultMessage: 'Status',
    },
    title: {
      id: 'app.containers.App.attributes.title',
      defaultMessage: 'Title',
    },
    description: {
      id: 'app.containers.App.attributes.description',
      defaultMessage: 'Content',
    },
    short_title: {
      id: 'app.containers.App.attributes.short_title',
      defaultMessage: 'Short title',
    },
    reference: {
      id: 'app.containers.App.attributes.reference',
      defaultMessage: 'No',
    },
    status: {
      id: 'app.containers.App.attributes.status',
      defaultMessage: 'Status',
    },
    url: {
      id: 'app.containers.App.attributes.url',
      defaultMessage: 'Website',
    },
    date: {
      id: 'app.containers.App.attributes.date',
      defaultMessage: 'Date',
    },
    target_date: {
      id: 'app.containers.App.attributes.target_date',
      defaultMessage: 'Target date',
    },
    targetDateEmpty: {
      id: 'app.containers.App.attributes.targetDateEmpty',
      defaultMessage: 'No target date set',
    },
    document_url: {
      id: 'app.containers.App.attributes.document_url',
      defaultMessage: 'Attached document',
    },
    documentEmpty: {
      id: 'app.containers.App.attributes.documentEmpty',
      defaultMessage: 'No document attached yet',
    },
    manager_id: {
      indicators: {
        id: 'app.containers.App.attributes.manager_id.indicators',
        defaultMessage: 'Assigned user',
      },
      categories: {
        id: 'app.containers.App.attributes.manager_id.categories',
        defaultMessage: 'Category manager',
      },
      categoriesEmpty: {
        id: 'app.containers.App.attributes.manager_id.categoriesEmpty',
        defaultMessage: 'No category manager assigned',
      },
      indicatorsEmpty: {
        id: 'app.containers.App.attributes.manager_id.indicatorsEmpty',
        defaultMessage: 'No indicator reporter assigned',
      },
    },
    meta: {
      title: {
        id: 'app.containers.App.attributes.meta.title',
        defaultMessage: 'Meta',
      },
      updated_by: {
        id: 'app.containers.App.attributes.meta.updated_by',
        defaultMessage: 'Updated by',
      },
      updated_at: {
        id: 'app.containers.App.attributes.meta.updated_at',
        defaultMessage: 'Last updated',
      },
    },
  },
  entities: {
    recommendations: {
      single: {
        id: 'app.containers.App.entities.recommendations.single',
        defaultMessage: 'Recommendation',
      },
      plural: {
        id: 'app.containers.App.entities.recommendations.plural',
        defaultMessage: 'Recommendations',
      },
      singleLong: {
        id: 'app.containers.App.entities.recommendations.singleLong',
        defaultMessage: 'HR body recommendation',
      },
      pluralLong: {
        id: 'app.containers.App.entities.recommendations.pluralLong',
        defaultMessage: 'HR body recommendations',
      },
    },
    measures: {
      single: {
        id: 'app.containers.App.entities.measures.single',
        defaultMessage: 'Action',
      },
      plural: {
        id: 'app.containers.App.entities.measures.plural',
        defaultMessage: 'Actions',
      },
      singleLong: {
        id: 'app.containers.App.entities.actions.singleLong',
        defaultMessage: 'Government action',
      },
      pluralLong: {
        id: 'app.containers.App.entities.actions.pluralLong',
        defaultMessage: 'Government actions',
      },
    },
    indicators: {
      single: {
        id: 'app.containers.App.entities.indicators.single',
        defaultMessage: 'Indicator',
      },
      plural: {
        id: 'app.containers.App.entities.indicators.plural',
        defaultMessage: 'Indicators',
      },
    },
    pages: {
      single: {
        id: 'app.containers.App.entities.pages.single',
        defaultMessage: 'Page',
      },
      plural: {
        id: 'app.containers.App.entities.pages.plural',
        defaultMessage: 'Pages',
      },
    },
    users: {
      single: {
        id: 'app.containers.App.entities.users.single',
        defaultMessage: 'User',
      },
      plural: {
        id: 'app.containers.App.entities.users.plural',
        defaultMessage: 'Users',
      },
    },
    progress_reports: {
      single: {
        id: 'app.containers.App.entities.progress_reports.single',
        defaultMessage: 'Progress report',
      },
      plural: {
        id: 'app.containers.App.entities.progress_reports.plural',
        defaultMessage: 'Progress reports',
      },
      empty: {
        id: 'app.containers.App.entities.progress_reports.empty',
        defaultMessage: 'No reports yet',
      },
      unscheduled: {
        id: 'app.containers.App.entities.progress_reports.unscheduled',
        defaultMessage: 'Extraordinary (no due date assigned)',
      },
    },
    taxonomies: {
      single: {
        id: 'app.containers.App.entities.taxonomies.single',
        defaultMessage: 'Category',
      },
      plural: {
        id: 'app.containers.App.entities.taxonomies.plural',
        defaultMessage: 'Categories',
      },
      1: {
        single: {
          id: 'app.containers.App.entities.taxonomies.1.single',
          defaultMessage: 'Human rights body',
        },
        plural: {
          id: 'app.containers.App.entities.taxonomies.1.plural',
          defaultMessage: 'Human rights bodies',
        },
        empty: {
          id: 'app.containers.App.entities.taxonomies.1.empty',
          defaultMessage: 'No human rights body assigned yet',
        },
      },
      2: {
        single: {
          id: 'app.containers.App.entities.taxonomies.2.single',
          defaultMessage: 'UN session',
        },
        plural: {
          id: 'app.containers.App.entities.taxonomies.2.plural',
          defaultMessage: 'UN sessions',
        },
        empty: {
          id: 'app.containers.App.entities.taxonomies.2.empty',
          defaultMessage: 'No UN session assigned yet',
        },
      },
      3: {
        single: {
          id: 'app.containers.App.entities.taxonomies.3.single',
          defaultMessage: 'Human right',
        },
        plural: {
          id: 'app.containers.App.entities.taxonomies.3.plural',
          defaultMessage: 'Human rights',
        },
        empty: {
          id: 'app.containers.App.entities.taxonomies.3.empty',
          defaultMessage: 'No human right assigned yet',
        },
      },
      4: {
        single: {
          id: 'app.containers.App.entities.taxonomies.4.single',
          defaultMessage: 'Affected persons',
        },
        plural: {
          id: 'app.containers.App.entities.taxonomies.4.plural',
          defaultMessage: 'Affected persons',
        },
        empty: {
          id: 'app.containers.App.entities.taxonomies.4.empty',
          defaultMessage: 'No affected persons assigned yet',
        },
      },
      5: {
        single: {
          id: 'app.containers.App.entities.taxonomies.5.single',
          defaultMessage: 'Thematic cluster',
        },
        plural: {
          id: 'app.containers.App.entities.taxonomies.5.plural',
          defaultMessage: 'Thematic clusters',
        },
        empty: {
          id: 'app.containers.App.entities.taxonomies.5.empty',
          defaultMessage: 'No thematic cluster assigned yet',
        },
      },
      6: {
        single: {
          id: 'app.containers.App.entities.taxonomies.6.single',
          defaultMessage: 'Organisation',
        },
        plural: {
          id: 'app.containers.App.entities.taxonomies.6.plural',
          defaultMessage: 'Organisations',
        },
        empty: {
          id: 'app.containers.App.entities.taxonomies.5.empty',
          defaultMessage: 'No organisation assigned yet',
        },
      },
    },
    due_dates: {
      single: {
        id: 'app.containers.App.entities.due_dates.single',
        defaultMessage: 'Due date',
      },
      plural: {
        id: 'app.containers.App.entities.due_dates.plural',
        defaultMessage: 'Due dates',
      },
      empty: {
        id: 'app.containers.App.entities.due_dates.empty',
        defaultMessage: 'No report scheduled',
      },
      overdue: {
        id: 'app.containers.App.entities.due_dates.overdue',
        defaultMessage: 'Report overdue',
      },
      due: {
        id: 'app.containers.App.entities.due_dates.due',
        defaultMessage: 'Report due',
      },
      scheduled: {
        id: 'app.containers.App.entities.due_dates.due',
        defaultMessage: 'Report scheduled',
      },
    },
    categories: {
      single: {
        id: 'app.containers.App.entities.categories.single',
        defaultMessage: 'Category',
      },
      plural: {
        id: 'app.containers.App.entities.categories.plural',
        defaultMessage: 'Categories',
      },
    },
    roles: {
      single: {
        id: 'app.containers.App.entities.roles.single',
        defaultMessage: 'User role',
      },
      plural: {
        id: 'app.containers.App.entities.roles.plural',
        defaultMessage: 'User roles',
      },
    },
  },
});
