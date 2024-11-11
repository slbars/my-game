// backend/src/types/node-cron.d.ts

declare module 'node-cron' {
  import { Job } from 'node-cron';

  interface ScheduleOptions {
    scheduled?: boolean;
    timezone?: string;
  }

  type ScheduleFunction = (cronTime: string, task: () => void, options?: ScheduleOptions) => Job;

  const cron: {
    schedule: ScheduleFunction;
    validate: (expression: string) => boolean;
    getTasks: () => Job[];
  };

  export default cron;
}
