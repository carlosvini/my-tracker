import WorklogRepository from '../../WorklogRepository';
import { NextApiRequest, NextApiResponse } from 'next';

export default (req: NextApiRequest, res: NextApiResponse) => {
  const activeWorklog = WorklogRepository.getFirstUnfinished();
  if (!activeWorklog) {
    return res.status(404).end();
  }
  res.json(activeWorklog);
}
