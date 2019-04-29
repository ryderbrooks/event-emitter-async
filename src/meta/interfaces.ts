import { tEventCB } from './types';



export interface IAsyncEventEmitter<E> {
  on( event: E, cb: tEventCB ): void;

  once( event: E, cb: tEventCB ): void;

  off( event: E, cb: tEventCB ): void;

  offOnce( event: E, cb: tEventCB ): void;

  emit( event: E, ...data: any[] ): Promise<true>;
}