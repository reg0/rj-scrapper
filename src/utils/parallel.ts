import { of, Observable, from } from 'rxjs';
import { mergeMap, catchError, toArray } from 'rxjs/operators';

export interface Task<T,R> {
  input: T;
  getTask: (input: T) => Observable<R>;
}

export interface TaskResult<T, R> {
  input: T;
  result: R | null;
  error?: Error;
}

export class ParallelTasks<T,R> {
  constructor(private tasks: Task<T,R>[]) { }

  doIt(parallelCount = 2): Observable<TaskResult<T,R>[]> {
    return from(this.tasks).pipe(
      mergeMap(
        task => task.getTask(task.input).pipe(
          catchError(e => of(new Error(e)))
        ), 
        (t, r) => (r instanceof Error ? {input: t.input, result: null, error: r} : {input: t.input, result: r}), 
        parallelCount
      ),
      toArray()
    );
  }
}
