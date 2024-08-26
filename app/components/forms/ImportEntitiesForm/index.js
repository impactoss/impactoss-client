import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Form } from 'react-redux-form/immutable';

import CsvDownloader from 'react-csv-downloader';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import {
  Text,
  Box,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  Accordion,
  AccordionPanel,
} from 'grommet';

import { omit } from 'lodash/object';
// import { map } from 'lodash/collection';

import asArray from 'utils/as-array';
import { truncateText } from 'utils/string';

import A from 'components/styled/A';
import Field from 'components/fields/Field';
import AccordionHeader from 'components/AccordionHeader';

import ViewPanel from 'components/EntityView/ViewPanel';
import Main from 'components/EntityView/Main';

import Messages from 'components/Messages';
import Loading from 'components/Loading';

import DocumentWrap from 'components/fields/DocumentWrap';
import FieldGroupWrapper from 'components/fields/FieldGroupWrapper';

import ButtonCancel from 'components/buttons/ButtonCancel';
import ButtonSubmit from 'components/buttons/ButtonSubmit';
import Clear from 'components/styled/Clear';

import ImportFileSelectControl from '../ImportFileSelectControl';
import FormWrapper from '../FormWrapper';
import FormBody from '../FormBody';
import FormFieldWrap from '../FormFieldWrap';
import FormFooter from '../FormFooter';
import FormFooterButtons from '../FormFooterButtons';

import messages from './messages';

const StyledForm = styled(Form)`
  display: table;
  width: 100%;
`;
const StyledAccordion = styled(Accordion)`
  button {
  box-shadow: unset;
  border-color: unset;
  outline: unset;
  &:focus-visible{
    outline: 2px solid ${palette('primary', 0)};
    outline-offset: 0px;
    }
  }
`;
const Importing = styled.div``;

const ImportingText = styled.div`
  font-weight: bold;
  font-size: 1em;
  color: ${palette('text', 1)};
  margin-bottom: 0.25em;
  margin-top: -0.5em;
  overflow: hidden;
  @media print {
    font-size: ${(props) => props.theme.sizes.print.default};
  }
`;

const DocumentWrapEdit = styled(DocumentWrap)`
  background-color: ${palette('background', 0)};
  position: relative;
  padding: 1em 0.75em;
`;

const FormTitle = styled.h3`
  padding-top: 0;
  margin-top: 0;
`;

const Intro = styled.div`
  margin-bottom: 10px;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    margin-bottom: 16px;
    font-size: 1.2em;
  }
  @media print {
    font-size: ${(props) => props.theme.sizes.print.large};
  }
`;
const Hint = styled.div`
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    margin-bottom: 16px;
    font-size: 1.2em;
  }
  @media print {
    font-size: ${(props) => props.theme.sizes.print.large};
  }
`;
const CsvDownload = styled.span`
  display: inline-block;
`;
const NoteLink = styled(A)`
  color: #BA5D03;
  &:hover {
    color: #BA5D03;
    text-decoration: underline;
  }
`;
const RowResults = styled.div`
  margin-top: 2em;
`;

const HintList = styled.ul`
  margin: 10px 0;
`;

const HintTitle = styled.h6`
  margin: 0;
  font-weight: normal;
`;
const ErrorHint = styled.div``;
const ErrorHintTitle = styled.h5``;
const ErrorHintText = styled.p``;

// These props will be omitted before being passed to the Control component
const nonControlProps = ['label', 'component', 'controlType', 'children', 'errorMessages'];

export class ImportEntitiesForm extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      activePanels: [],
    };
  }

  getControlProps = (field) => omit(field, nonControlProps);

  render() {
    const {
      model,
      handleSubmit,
      handleCancel,
      handleReset,
      fieldModel,
      template,
      formData,
      progress,
      errors,
      success,
      sending,
    } = this.props;
    const { intl } = this.context;
    const field = {
      id: 'file',
      model: `.${fieldModel}`,
      placeholder: 'filename',
    };

    const { id, ...props } = this.getControlProps(field);

    // const rows = formData
    //   && formData.getIn(['import', 'rows']);

    const stats = {
      // totalRows: rows && rows.length,
      // sendingNo: sending && sending.size,
      // sendingByRow: sending && sending.groupBy((item) => item.saveRef).toJS(),
      totalRowsSending: sending && sending.groupBy((item) => item.saveRef).size,
      // successNo: success && success.size,
      // successByRow: success && success.groupBy((item) => item.saveRef).toJS(),
      // totalRowsSuccess: success && success.groupBy((item) => item.saveRef).size,
      // errorsNo: errors && errors.size,
      // errorsByRow: errors && errors.groupBy((item) => item.data && item.data.saveRef).toJS(),
      totalRowsErrors: errors && errors.groupBy((item) => item.data.saveRef).size,
    };
    return (
      <FormWrapper white>
        <StyledForm model={model} onSubmit={(data) => data.get('import') !== null && handleSubmit(data)}>
          <FormBody>
            <ViewPanel>
              <Main bottom>
                <FieldGroupWrapper>
                  <FormTitle>
                    <FormattedMessage {...messages.title} />
                  </FormTitle>
                  <Intro>
                    <Text size="medium">
                      <FormattedMessage {...messages.introduction} />
                    </Text>
                  </Intro>
                  <Hint>
                    <HintTitle>
                      <Text size="medium">
                        <FormattedMessage {...messages.hintTitle} />
                      </Text>
                    </HintTitle>
                    <HintList>
                      <li>
                        <Text size="medium">
                          <FormattedMessage {...messages.templateHint} />
                        </Text>
                        <CsvDownload>
                          <CsvDownloader
                            datas={asArray(template.data)}
                            filename={template.filename}
                          >
                            <NoteLink href="/" onClick={(evt) => evt.preventDefault()}>
                              <Text size="medium">
                                <FormattedMessage {...messages.templateHintDownloadLink} />
                              </Text>
                            </NoteLink>
                          </CsvDownloader>
                        </CsvDownload>
                      </li>
                      <li>
                        <Text size="medium">
                          <FormattedMessage {...messages.formatHint} />
                        </Text>
                        {messages.formatHintLink && messages.formatHintLink !== '' && (
                          <A href={intl.formatMessage(messages.formatHintLink)} target="_blank">
                            <Text size="medium">
                              {intl.formatMessage(messages.formatHintLinkAnchor)}
                            </Text>
                          </A>
                        )}
                      </li>
                    </HintList>
                  </Hint>
                  <Field noPadding>
                    <FormFieldWrap>
                      {(progress === null) && (
                        <ImportFileSelectControl
                          id={id}
                          model={field.model}
                          as="text"
                          accept=".csv, text/csv"
                          {...props}
                        />
                      )}
                      {progress !== null && (
                        <div>
                          {progress < 100 && (
                            <DocumentWrapEdit>
                              <Importing>
                                <ImportingText>
                                  <FormattedMessage {...messages.importing} />
                                  { formData && `"${formData.get('import').file.name}"`}
                                </ImportingText>
                                <Loading progress={progress} />
                              </Importing>
                            </DocumentWrapEdit>
                          )}
                          {progress >= 100 && (
                            <div>
                              {(
                                stats.totalRowsErrors > 0
                                && stats.totalRowsSending === stats.totalRowsErrors
                              )
                              && (
                                <Messages
                                  type="error"
                                  message={intl.formatMessage(messages.allErrors)}
                                />
                              )}
                              {(
                                stats.totalRowsErrors > 0
                                && stats.totalRowsSending > stats.totalRowsErrors
                              ) && (
                                <Messages
                                  type="error"
                                  message={intl.formatMessage(messages.someErrors, {
                                    successNo: stats.totalRowsSending - stats.totalRowsErrors,
                                    errorNo: stats.totalRowsErrors,
                                    tryNo: stats.totalRowsSending,
                                  })}
                                />
                              )}
                              {(stats.totalRowsErrors === 0) && (
                                <Messages
                                  type="success"
                                  message={intl.formatMessage(messages.success, {
                                    tryNo: success.size,
                                  })}
                                />
                              )}
                            </div>
                          )}
                          {(progress >= 100 && stats.totalRowsSending > 0) && (
                            <RowResults>
                              <FormattedMessage {...messages.rowResultsHint} />
                              {sending
                                && sending.groupBy(
                                  (item) => item && item.saveRef
                                ).sortBy(
                                  (item, key) => key
                                ).entrySeq().map(
                                  ([rowNo, row]) => row.entrySeq().map(
                                    ([rowItemKey, rowItem]) => {
                                      const error = errors.get(rowItemKey);
                                      const isMainItem = !!rowItem.entity;
                                      const rowItemRef = isMainItem
                                        && (rowItem.entity.attributes.reference || truncateText(rowItem.entity.attributes.title, 22));
                                      let message = intl.formatMessage(messages.resultRowNo, { rowNo });
                                      if (error) {
                                        message = `${message} ${intl.formatMessage(messages.resultError, { isMainItem })}`;
                                        if (isMainItem) {
                                          message = `${message}: ${rowItemRef}`;
                                        }
                                        message = error.error.messages.reduce(
                                          (memo, msg) => `${memo} "${msg}"`,
                                          message,
                                        );
                                      } else {
                                        message = `${message} ${intl.formatMessage(messages.resultSuccess, { isMainItem })}`;
                                        if (isMainItem) {
                                          message = `${message}: ${rowItemRef}`;
                                        }
                                      }
                                      return (
                                        <Messages
                                          key={rowItemKey}
                                          type={error ? 'error' : 'success'}
                                          details
                                          preMessage={false}
                                          messages={[message]}
                                        />
                                      );
                                    }
                                  )
                                )
                              }
                            </RowResults>
                          )}
                          {(progress >= 100 && errors.size > 0 && progress >= 100) && (
                            <ErrorHint>
                              <ErrorHintTitle>
                                <FormattedMessage {...messages.errorHintTitle} />
                              </ErrorHintTitle>
                              <ErrorHintText>
                                <FormattedMessage {...messages.errorHintText} />
                              </ErrorHintText>
                            </ErrorHint>
                          )}
                        </div>
                      )}
                    </FormFieldWrap>
                  </Field>
                </FieldGroupWrapper>
              </Main>
            </ViewPanel>
          </FormBody>
          {progress === null && template.data && (
            <Box margin="medium">
              <StyledAccordion
                onActive={(newActive) => this.setState({ activePanels: newActive })}
                animate={false}
              >
                <AccordionPanel
                  header={(
                    <AccordionHeader
                      title={this.state.activePanels.includes(0)
                        ? 'Hide field/column overview'
                        : 'Show field/column overview'
                      }
                      open={this.state.activePanels.includes(0)}
                    />
                  )}
                >
                  <Box
                    background="light-1"
                    pad="medium"
                    margin={{
                      top: '2px', // for focus-visible outline on panel header
                    }}
                  >
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableCell scope="col" border="bottom">
                            <Text size="xsmall" weight={600}>Field/column name</Text>
                          </TableCell>
                          <TableCell scope="col" border="bottom">
                            <Text size="xsmall" weight={600}>Content/info</Text>
                          </TableCell>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {template.data && Object.keys(template.data).filter((d) => d.trim() !== '').map(
                          (d, index) => (
                            <TableRow key={index}>
                              <TableCell scope="row">
                                <Text size="xsmall">{d}</Text>
                              </TableCell>
                              <TableCell>
                                <Text size="xsmall">{template.data[d]}</Text>
                              </TableCell>
                            </TableRow>
                          )
                        )}
                      </TableBody>
                    </Table>
                  </Box>
                </AccordionPanel>
              </StyledAccordion>
            </Box>
          )}
          { progress >= 100
            && (
              <FormFooter>
                <FormFooterButtons>
                  <ButtonCancel type="button" onClick={handleReset}>
                    <FormattedMessage {...messages.importAgain} />
                  </ButtonCancel>
                  <ButtonSubmit type="button" onClick={handleCancel}>
                    <FormattedMessage {...messages.done} />
                  </ButtonSubmit>
                </FormFooterButtons>
                <Clear />
              </FormFooter>
            )
          }
        </StyledForm>
      </FormWrapper>
    );
  }
}

ImportEntitiesForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleReset: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  model: PropTypes.string,
  fieldModel: PropTypes.string,
  formData: PropTypes.object,
  progress: PropTypes.number,
  errors: PropTypes.object,
  success: PropTypes.object,
  template: PropTypes.object,
  sending: PropTypes.object,
};

ImportEntitiesForm.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default ImportEntitiesForm;
