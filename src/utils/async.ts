type asyncFnType<T, R> = (obj: T, index: number, arr: T[]) => R

export const asyncForEach = async <T>(array: T[], asyncFn: asyncFnType<T,void>) => {
  for (let i = 0; i < array.length; i++) {
    await asyncFn(array[i], i, array);
  }
}

export const asyncFind = async <T>(array: T[], asyncFn: asyncFnType<T, Promise<boolean>>) => {
  for (let i = 0; i < array.length; i++) {
    if (await asyncFn(array[i], i, array)) {
      return array[i];
    };
  }
  return undefined;
}

export const asyncMap: <T, R>(array: T[], asyncFn: asyncFnType<T, Promise<R>>) => Promise<R[]> = async <T, R>(array: T[], asyncFn: asyncFnType<T, Promise<R>>) => {
  const result: R[] = [];
  for (let i = 0; i < array.length; i++) {
    result.push(await asyncFn(array[i], i, array));
  }
  return result;
}

export const asyncFilter = async <T>(array: T[], asyncFn: asyncFnType<T, Promise<boolean>>) => {
  const result = [];
  for (let i = 0; i < array.length; i++) {
    if (await asyncFn(array[i], i, array)) {
      result.push(array[i]);
    }
  }
  return result;
}