import React from 'react';
import PropTypes from 'prop-types';
import { Map, fromJS } from 'immutable';
import { connect } from 'react-redux';
import { isEqual } from 'lodash/lang';
import { Form, actions as formActions } from 'react-redux-form/immutable';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import { injectIntl } from 'react-intl';

import { lowerCase } from 'utils/string';
import appMessage from 'utils/app-message';

import ContainerWrapperSidebar from 'components/styled/Container/ContainerWrapperSidebar';
import MultiSelectControl from 'components/forms/MultiSelectControl';

import {
  FILTER_FORM_MODEL,
} from './constants';
import {
  setFilter,
} from './actions';

const Styled = styled(ContainerWrapperSidebar)`
  z-index: ${(props) => props.sidebarResponsiveLarge ? 99 : 101};
  background-color: rgba(0,0,0,0.2);
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    z-index: 99;
  }
`;

const FormWrapper = styled.div`
  position: fixed;
  top: ${(props) => props.theme.sizes.header.banner.heightMobile + props.theme.sizes.header.nav.heightMobile}px;
  bottom: 0;
  left: 0;
  background: ${palette('primary', 4)};
  overflow: hidden;
  box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.2);
  width: 100%;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    width: ${(props) => props.wide ? '100%' : '350px'};
    left: ${(props) => props.responsiveSmall
    ? props.theme.sizes.aside.width.small
    : props.theme.sizes.aside.width.large
}px;
    top: ${(props) => props.theme.sizes.header.banner.height + props.theme.sizes.header.nav.height}px;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    width: ${(props) => props.wide ? 692 : 350}px;
    z-index: 99;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    left: ${(props) => props.theme.sizes.aside.width.large}px;
  }
`;
// z-index:-1;

class EntityListForm extends React.Component { // eslint-disable-line react/prefer-stateless-function
  UNSAFE_componentWillMount() {
    this.props.initialiseForm(this.props.model, this.props.formOptions.options);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // Todo this is not efficent, parent component is creating a new map every time so we can't hashCode compare :(
    if (!isEqual(nextProps.formOptions.options, this.props.formOptions.options)) {
      this.props.initialiseForm(nextProps.model, nextProps.formOptions.options);
    }
  }

  render() {
    const {
      model, onSubmit, onCancel, buttons, formOptions, activeOptionId, showCancelButton, intl,
    } = this.props;
    let formTitle;
    if (formOptions.message) {
      formTitle = formOptions.messagePrefix
        ? `${formOptions.messagePrefix} ${lowerCase(appMessage(intl, formOptions.message))}`
        : appMessage(intl, formOptions.message);
    } else {
      formTitle = formOptions.title;
    }
    return (
      <Styled
        sidebarResponsiveLarge={!formOptions.advanced}
        sidebarAbsolute
        onClick={(evt) => {
          evt.preventDefault();
          onCancel();
        }}
      >
        <FormWrapper
          wide={formOptions.advanced}
          onClick={(evt) => evt.stopPropagation()}
        >
          <Form
            model={model}
            onSubmit={onSubmit}
          >
            <MultiSelectControl
              model=".values"
              threeState
              title={formTitle}
              options={fromJS(formOptions.options).toList()}
              multiple={formOptions.multiple}
              required={formOptions.required}
              search={formOptions.search}
              advanced={formOptions.advanced}
              groups={formOptions.groups}
              closeOnClickOutside={false}
              selectAll={formOptions.multiple && formOptions.selectAll}
              tagFilterGroups={formOptions.tagFilterGroups}
              panelId={activeOptionId}
              onCancel={showCancelButton && onCancel ? onCancel : null}
              onChange={(values) => {
                this.props.onFormChange(values, model);
                this.props.onSelect();
              }}
              buttons={buttons}
            />
          </Form>
        </FormWrapper>
      </Styled>
    );
  }
}

EntityListForm.propTypes = {
  initialiseForm: PropTypes.func.isRequired,
  onFormChange: PropTypes.func.isRequired,
  model: PropTypes.string.isRequired,
  formOptions: PropTypes.object,
  onSubmit: PropTypes.func,
  onSelect: PropTypes.func,
  onCancel: PropTypes.func,
  buttons: PropTypes.array,
  activeOptionId: PropTypes.string,
  showCancelButton: PropTypes.bool,
  intl: PropTypes.object.isRequired,
};

EntityListForm.defaultProps = {
  showCancelButton: true,
};

const mapDispatchToProps = (dispatch) => ({
  // resetForm: (model) => {
  //   dispatch(formActions.reset(model));
  // },
  initialiseForm: (model, options) => {
    dispatch(formActions.load(model, Map({ values: fromJS(options).toList() })));
  },
  onFormChange: (values, model) => {
    if (model === FILTER_FORM_MODEL) {
      dispatch(setFilter(values));
    }
  },
});

export default injectIntl(connect(null, mapDispatchToProps)(EntityListForm));
