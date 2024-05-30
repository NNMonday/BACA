export function capitalizeString(str) {
  let words = str.split(" ");

  let capitalizedWords = words.map((word) => {
    if (word === "") {
      return "";
    }
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });

  return capitalizedWords.join(" ");
}

export function numberWithDots(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function calculateCartSum(cart) {
  return cart.reduce((sum, i) => (sum += i.price * i.quantity), 0);
}

export function validatePhoneNumber(phoneNumber) {
  const phoneNumberPattern = /^0\d{9}$/;
  return phoneNumberPattern.test(phoneNumber);
}

export function pushAndReturnCopy(arr, element) {
  const newArr = [...arr];
  newArr.push(element);
  return newArr;
}

export function removeByValue(arr, value) {
  const newArr = [...arr];
  const index = newArr.indexOf(value);
  if (index !== -1) {
    newArr.splice(index, 1);
  } else {
    console.error("Value not found in array");
  }

  return newArr;
}
