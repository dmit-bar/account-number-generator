const weights = [
  7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1,
];

const NOT_NUMBER = "Значение должно быть числом";
const NOT_EXACT_LENGTH = (length: number) => `Должно быть ${length} символов`;

const generateAccountNumber = (
  bic: string,
  accountMask: string,
  currencyCode: string
): string => {
  if (
    bic.length !== 9 ||
    accountMask.length !== 5 ||
    currencyCode.length !== 3
  ) {
    return "";
  }

  // Последние 3 цифры из БИК
  const bicNumbers = bic.slice(-3);

  // * Первая часть счета *
  const accountNumberFirstPart = `${bicNumbers}${accountMask}${currencyCode}`;

  // * Вторая часть счета *

  // Генерим случайные числа (getTime() вернет минимум 13 чисел, убираем одно в начале)
  const accountNumberSecondPartArray = new Date()
    .getTime()
    .toString()
    .slice(-12)
    .split("");

  // Ставим 0 в каждую 3 позицию (там где вес "1")
  weights.slice(11).forEach((weight, idx) => {
    if (weight === 1) {
      accountNumberSecondPartArray[idx] = "0";
    }
  });

  const accountNumberFirstIteration = `${accountNumberFirstPart}${accountNumberSecondPartArray.join(
    ""
  )}`;

  const initialKeyValue = 0;

  // Первая итерация ключа, с 0 в позициях с весом "1"
  const firstIterationKey = weights.reduce(
    (accumulator, currentWeight, idx) =>
      accumulator +
      ((currentWeight * Number(accountNumberFirstIteration[idx])) % 10),
    initialKeyValue
  );

  // Если сдвига не требуется то возвращаем первую итерацию номера счета
  if (firstIterationKey % 10 === 0) {
    return accountNumberFirstIteration.slice(3);
  }

  // Определяем какую цифру нужно докинуть чтобы получился валидный ключ
  const offset = 10 - (firstIterationKey % 10);

  // В первую цифру с весом "1" подставляем neededOffset
  const accountNumberSecondIteration = accountNumberFirstIteration
    .split("")
    .reduce((accumulator, currentNumber, idx) => {
      return `${accumulator}${idx === 13 ? `${offset}` : currentNumber}`;
    });

  return accountNumberSecondIteration.slice(3);
};

export { NOT_EXACT_LENGTH, NOT_NUMBER, generateAccountNumber };
