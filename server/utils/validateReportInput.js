import isEmpty from './is_empty';

/**
 *
 * @description controller class for reports input validation
 *  @class ReportInputValidation
 */
class ReportInputValidation {
  /**
   *  @description method for validation of report input
   *  @param {object} data body of the user's request
   *  @returns {object} The body of  the response message
   */
  static validateArticleReportInput(data) {
    const error = {};
    data.reasonForReport = data.reasonForReport ? data.reasonForReport : '';
    data.reportBody = data.reportBody ? data.reportBody : '';
    const reasons = [
      'it has violent content',
      'this is hate speech',
      'this is false news',
      'it has pornographic content',
      'it is a spam',
      'other'
    ];
    const arrayContains = (needle, haystack) => (haystack.indexOf(needle) > -1);

    if (!(data.reasonForReport)) {
      error.reasonForReport = 'please select a reason for your report';
    }
    if (data.reasonForReport && !arrayContains(data.reasonForReport, reasons)) {
      error.reasonForReport = 'Please select from the defined reasons';
    }

    if (data.reasonForReport === 'other' && !(data.reportBody)) {
      error.reportBody = 'please let us know your concerns about this article';
    }

    return {
      error,
      isValid: isEmpty(error),
      status: 'error'
    };
  }
}

export default ReportInputValidation;
