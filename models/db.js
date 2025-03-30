import Dexie from "dexie";

class IdeasDB extends Dexie {
  constructor() {
    super("IdeasDB");
    this.version(1).stores({
      ideas: "++id,title,description,content,creationdate,lastedited,status,ideatype",
    });
    this.ideas = this.table("ideas");
  }
}

export const db = new IdeasDB();