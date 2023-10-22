import Dexie from "dexie";

export class MySubClassedDexie extends Dexie {
  constructor() {
    super("myDatabase");
    this.version(1).stores({});
  }
}

export const db = new MySubClassedDexie();
