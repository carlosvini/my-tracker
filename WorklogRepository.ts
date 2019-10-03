import fs from 'fs';

interface WorklogFromJson {
  client: string,
  start: string,
  end?: string,
}

export interface Worklog {
  client: string,
  start: Date,
  end?: Date,
}

class WorklogRepository {
  private worklogs: Worklog[];

  constructor() {
    const data: WorklogFromJson[] = JSON.parse(fs.readFileSync('./data.json').toString());
    this.worklogs = data.map(item => ({
      ...item,
      start: new Date(item.start),
      end: item.end ? new Date(item.end) : undefined,
    }));
  }

  get(): Worklog[] {
    return this.worklogs;
  }

  getFirstUnfinished(): Worklog | undefined {
    return this.get().find(x => x.end == undefined);
  }

  insert(obj: Worklog): void {
    const worklogs = this.get();
    worklogs.push(obj);
    this.update(worklogs);
  }

  update(worklogs: Worklog[]): void {
    this.worklogs = worklogs;
    fs.writeFileSync('./data.json', JSON.stringify(worklogs));
  }

  save(worklog: Worklog): void {
    const worklogs = this.get();
    const index = worklogs.findIndex(x => x.start === worklog.start);
    worklogs[index] = worklog;
    this.update(worklogs);
  }
}

export default new WorklogRepository;
