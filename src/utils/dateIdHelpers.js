import moment from 'moment';

export const getDateIdFromDate = (date) => moment(date).format('YYYYMMDD').toString();

export const getTodayDateId = () => getDateIdFromDate(moment());

export const getDateFromDateId = (dateId, format) => {
  const momentObject = moment(dateId, 'YYYYMMDD');
  if (format) {
    return momentObject.format(format);
  }
  return momentObject.toISOString();
};

export const getOtherDateIdFromDateId = (dateId, amount) => moment(dateId, 'YYYYMMDD')
  .add(amount, 'day')
  .format('YYYYMMDD');

export const getPreviousDateId = (dateId) => getOtherDateIdFromDateId(dateId, -1);
export const getNextDateId = (dateId) => getOtherDateIdFromDateId(dateId, 1);
