import { AsyncEventEmitter }  from '../lib/AsyncEventEmitter';
import { IAsyncEventEmitter } from '../meta/interfaces';
import { ERROR_MESSAGES }     from '../meta/enums';


describe('AsyncEventEmitter', () => {
  const enum T_EVENTS {
    TEST = 'test',
    FAKE = 'fake'
  }



  describe('#offOnce', () => {
    it('removes callback from #once but leaves #on', async () => {
      const emitter: IAsyncEventEmitter<T_EVENTS> = new AsyncEventEmitter();
      const spy                                   = jest.fn();

      emitter.on(T_EVENTS.TEST, spy);
      emitter.once(T_EVENTS.TEST, spy);
      emitter.offOnce(T_EVENTS.TEST, spy);
      await emitter.emit(T_EVENTS.TEST, true);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(true);
    });


    it('does not trigger callback when removed', async () => {
      const emitter: IAsyncEventEmitter<T_EVENTS> = new AsyncEventEmitter();
      const spy                                   = jest.fn();

      emitter.once(T_EVENTS.TEST, spy);
      emitter.offOnce(T_EVENTS.TEST, spy);
      await emitter.emit(T_EVENTS.TEST, true);
      expect(spy).not.toHaveBeenCalled();
    });

  });

  describe('#off', () => {

    it('removes callback from #on but leaves #once', async () => {
      const emitter: IAsyncEventEmitter<T_EVENTS> = new AsyncEventEmitter();
      const spy                                   = jest.fn();

      emitter.on(T_EVENTS.TEST, spy);
      emitter.once(T_EVENTS.TEST, spy);
      emitter.off(T_EVENTS.TEST, spy);
      await emitter.emit(T_EVENTS.TEST, true);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(true);
    });

    it('does not trigger callback when removed', async () => {
      const emitter: IAsyncEventEmitter<T_EVENTS> = new AsyncEventEmitter();
      const spy                                   = jest.fn();

      emitter.on(T_EVENTS.TEST, spy);
      emitter.off(T_EVENTS.TEST, spy);
      await emitter.emit(T_EVENTS.TEST, true);
      expect(spy).not.toHaveBeenCalled();
    });
  });


  describe('#on', () => {
    it('throws x when a callback instance is added to the same event multiple times',
       () => {
         const emitter: IAsyncEventEmitter<T_EVENTS> = new AsyncEventEmitter();
         const spy                                   = jest.fn();
         emitter.on(T_EVENTS.TEST, spy);
         expect(() => emitter.on(T_EVENTS.TEST, spy))
           .toThrow(ERROR_MESSAGES.DUPLICATE_CALLBACK);
       });
    it('calls the callback when the event is emitted that it is registered for',
       async () => {
         const emitter: IAsyncEventEmitter<T_EVENTS> = new AsyncEventEmitter();
         const spy                                   = jest.fn();

         emitter.on(T_EVENTS.TEST, spy);
         await emitter.emit(T_EVENTS.TEST, true);
         expect(spy).toHaveBeenCalledWith(true);
       });

    it('calls the registered callback 1 time when the event is triggered',
       async () => {
         const emitter: IAsyncEventEmitter<T_EVENTS> = new AsyncEventEmitter();
         const spy                                   = jest.fn();
         emitter.on(T_EVENTS.TEST, spy);
         await emitter.emit(T_EVENTS.TEST, true);
         expect(spy).toHaveBeenCalledWith(true);
       });

    it('calls the registered callback 2 times when the event is triggered twice',
       async () => {
         const emitter: IAsyncEventEmitter<T_EVENTS> = new AsyncEventEmitter();
         const spy                                   = jest.fn();
         emitter.on(T_EVENTS.TEST, spy);
         await emitter.emit(T_EVENTS.TEST, true);
         await emitter.emit(T_EVENTS.TEST, true);
         expect(spy).toHaveBeenNthCalledWith(1, true);
         expect(spy).toHaveBeenNthCalledWith(2, true);
         expect(spy).toHaveBeenCalledTimes(2);
       });

    it('does not call the callback when an event is emitted that it is not registered'
       + ' for', async () => {
      const emitter: IAsyncEventEmitter<T_EVENTS> = new AsyncEventEmitter();
      const spy                                   = jest.fn();
      emitter.on(T_EVENTS.FAKE, spy);
      await emitter.emit(T_EVENTS.TEST, true);

      expect(spy).not.toHaveBeenCalled();
    });
  });


  describe('#once', () => {
    it('throws when a callback instance is added to the same event multiple times',
       () => {
         const emitter: IAsyncEventEmitter<T_EVENTS> = new AsyncEventEmitter();
         const spy                                   = jest.fn();
         emitter.once(T_EVENTS.TEST, spy);
         expect(() => emitter.once(T_EVENTS.TEST, spy))
           .toThrow(ERROR_MESSAGES.DUPLICATE_CALLBACK);
       });
    it('calls the callback when the event is emitted that it is registered for',
       async () => {
         const emitter: IAsyncEventEmitter<T_EVENTS> = new AsyncEventEmitter();
         const spy                                   = jest.fn();
         emitter.once(T_EVENTS.TEST, spy);
         await emitter.emit(T_EVENTS.TEST, true);
         expect(spy).toHaveBeenCalledWith(true);
       });

    it('calls the registered callback 1 time when the event is triggered',
       async () => {
         const emitter: IAsyncEventEmitter<T_EVENTS> = new AsyncEventEmitter();
         const spy                                   = jest.fn();
         emitter.once(T_EVENTS.TEST, spy);
         await emitter.emit(T_EVENTS.TEST, true);
         expect(spy).toHaveBeenCalledWith(true);
       });


    it('only calls the registered callback 1 time event though the event is triggered'
       + ' twice',
       async () => {
         const emitter: IAsyncEventEmitter<T_EVENTS> = new AsyncEventEmitter();
         const spy                                   = jest.fn();
         emitter.once(T_EVENTS.TEST, spy);
         await emitter.emit(T_EVENTS.TEST, true);
         expect(spy).toHaveBeenCalledWith(true);
       });


    it('does not call the callback when an event is emitted that it is not registered'
       + ' for', async () => {
      const emitter: IAsyncEventEmitter<T_EVENTS> = new AsyncEventEmitter();
      const spy                                   = jest.fn();
      emitter.once(T_EVENTS.FAKE, spy);
      await emitter.emit(T_EVENTS.TEST, true);

      expect(spy).not.toHaveBeenCalled();
    });
  });
});