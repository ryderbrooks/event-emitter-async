import { tEventCB }           from '../meta/types';
import { IAsyncEventEmitter } from '../meta/interfaces';
import { IPopSet, PopSet }    from 'pop-set';



export class AsyncEventEmitter<E> implements IAsyncEventEmitter<E> {
  public on( event: E, cb: tEventCB ): void {
    this._addEventListener(this.events, event, cb);
  }


  public once( event: E, cb: tEventCB ): void {
    this._addEventListener(this.onceEvents, event, cb);
  }


  public off( event: E, cb: tEventCB ): void {
    this._removeListener(this.events, event, cb);
  }


  public offOnce( event: E, cb: tEventCB ): void {
    this._removeListener(this.onceEvents, event, cb);
  }


  public async emit( event: E, ...data: any[] ): Promise<true> {
    await Promise.all(this._emitOnceEvents(event, data));
    await Promise.all(this._emit(event, data));
    return true;
  }


  private events: Map<E, IPopSet<tEventCB>>     = new Map();
  private onceEvents: Map<E, IPopSet<tEventCB>> = new Map();


  private _addEventListener( collection: Map<E, IPopSet<tEventCB>>,
                             event: E,
                             cb: tEventCB ): void {
    switch ( true ) {
      case collection.has(event):
        if( collection.get(event)!.has(cb) ) {
          throw new Error(ERROR_MESSAGES.DUPLICATE_CALLBACK);
        }
        collection.get(event)!.add(cb);
        break;
      default:
        collection.set(event, new PopSet([ cb ]));
    }
  }


  private _removeListener( collection: Map<E, IPopSet<tEventCB>>,
                           event: E,
                           cb: tEventCB ): void {
    switch ( false ) {
      case collection.has(event):
      case collection.get(event)!.has(cb):
        break;
      default:
        collection.get(event)!.delete(cb);
        if( collection.get(event)!.size === 0 ) {
          collection.delete(event);
        }
    }
  }


  private _hasListeners( callbacks: Map<E, IPopSet<tEventCB>>,
                         event: E ): boolean {
    switch ( false ) {
      case callbacks.has(event):
      case callbacks.get(event)!.size > 0:
        return false;
      default:
        return true;
    }
  }


  private _emitOnceEvents( event: E, data: any[] ): Promise<void>[] {
    const l: Promise<void>[] = [];
    if( this._hasListeners(this.onceEvents, event) ) {

      this.onceEvents.get(event)!
        .forEach(( cb ): void => {
          l.push(new Promise(( res ): void => {
            setImmediate((): void => {
              cb(...data);
              res();
            });
          }));
        });
      this.onceEvents.delete(event);
    }
    return l;
  }


  private _emit( event: E, data: any[] ): Promise<void>[] {
    const l: Promise<void>[] = [];
    if( this._hasListeners(this.events, event) ) {

      this.events.get(event)!
        .forEach(( cb: tEventCB ): void => {
          l.push(new Promise(( res ): void => {
            setImmediate((): void => {
              cb(...data);
              res();
            });
          }));
        });

    }
    return l;
  }
}

