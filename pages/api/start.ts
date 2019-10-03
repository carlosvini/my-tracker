import WorklogRepository from '../../WorklogRepository';
import { NextApiRequest, NextApiResponse } from 'next';

export default (req: NextApiRequest, res: NextApiResponse) => {
  const client = req.query.client || req.body.client;
  if (!client) {
    return res.status(400).end();
  }
  const unfinished = WorklogRepository.getFirstUnfinished();
  if (unfinished) {
    return res.status(409).end();
  }
  const newWorklog = {
    client,
    start: new Date,
    end: undefined
  };
  WorklogRepository.insert(newWorklog);

  res.json(newWorklog);
}
