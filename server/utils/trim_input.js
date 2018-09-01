import validator from 'validator';

const trimInput = data => data && validator.trim(data).replace(/ +(?= )/g, '');

export default trimInput;
