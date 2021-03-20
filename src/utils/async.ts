type asyncFnType<T, R> = (obj: T, index: number, arr: T[]) => Promise<R>
type asyncReduceFnType<T, R> = (acc: R, obj: T, index: number, arr: T[]) => Promise<R>

export const asyncForEach = async <T>(array: T[], asyncFn: asyncFnType<T,void>): Promise<void> => {
  for (let i = 0; i < array.length; i++) {
    await asyncFn(array[i], i, array);
  }
}

export const asyncIterate = async (minI: number, maxI: number, asyncFn: (i: number) => void): Promise<void> => {
  for (let i = minI; i < maxI; i++) {
    await asyncFn(i);
  }
}

export const asyncFind = async <T>(array: T[], asyncFn: asyncFnType<T, boolean>): Promise<T | undefined> => {
  for (let i = 0; i < array.length; i++) {
    if (await asyncFn(array[i], i, array)) {
      return array[i];
    }
  }
  return undefined;
}

export const asyncMap = async <T, R>(array: T[], asyncFn: asyncFnType<T, R>): Promise<R[]> => {
  const result: R[] = [];
  for (let i = 0; i < array.length; i++) {
    result.push(await asyncFn(array[i], i, array));
  }
  return result;
}

export const asyncReduce = async <T, R>(array: T[], asyncFn: asyncReduceFnType<T, R>, initialValue: R): Promise<R> => {
  let result = initialValue;
  for (let i = 0; i < array.length; i++) {
    result = await asyncFn(result, array[i], i, array);
  }
  return result;
}

export const asyncFilter = async <T>(array: T[], asyncFn: asyncFnType<T, boolean>): Promise<T[]> => {
  const result = [];
  for (let i = 0; i < array.length; i++) {
    if (await asyncFn(array[i], i, array)) {
      result.push(array[i]);
    }
  }
  return result;
}