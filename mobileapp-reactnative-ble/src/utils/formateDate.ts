const formateDate = (inputDate: Date, whitHour: boolean): string => {
  if (!whitHour) {
    return (
      inputDate.getDate().toString().padStart(2, '0') +
      '/' +
      inputDate.getMonth().toString().padStart(2, '0') +
      '/' +
      inputDate.getFullYear().toString().padStart(2, '0')
    );
  } else {
    return (
      inputDate.getDate().toString().padStart(2, '0') +
      '/' +
      inputDate.getMonth().toString().padStart(2, '0') +
      '/' +
      inputDate.getFullYear().toString().padStart(2, '0') +
      ' ' +
      inputDate.getHours().toString().padStart(2, '0') +
      ':' +
      inputDate.getMinutes().toString().padStart(2, '0') +
      ':' +
      inputDate.getSeconds().toString().padStart(2, '0')
    );
  }
};

export default formateDate;
