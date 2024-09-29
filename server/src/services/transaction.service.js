import mongoose from "mongoose";
import { AsyncLocalStorage } from "async_hooks";

const asyncLocalStorage = new AsyncLocalStorage();

class TransactionService {
  constructor() {
    this.currentSession = null;
  }

  async start(callback) {
    return asyncLocalStorage.run(new Map(), async () => {
      try {
        this.currentSession = await mongoose.startSession();
        this.currentSession.startTransaction();
        asyncLocalStorage.getStore().set("session", this.currentSession);
        const result = await callback(this.currentSession);
        await this.commit();
        return result;
      } catch (error) {
        await this.abort();
        throw error;
      } finally {
        asyncLocalStorage.getStore().delete("session");
      }
    });
  }

  getSession() {
    return asyncLocalStorage.getStore().get("session") || null;
  }

  async commit() {
    if (this.currentSession) {
      try {
        await this.currentSession.commitTransaction();
      } catch (error) {
        console.error("Error committing transaction:", error);
        throw error;
      } finally {
        this.currentSession.endSession();
        this.currentSession = null;
      }
    }
  }

  async abort() {
    if (this.currentSession) {
      try {
        await this.currentSession.abortTransaction();
      } catch (error) {
        console.error("Error aborting transaction:", error);
        throw error;
      } finally {
        this.currentSession.endSession();
        this.currentSession = null;
      }
    }
  }
}

export default new TransactionService();
