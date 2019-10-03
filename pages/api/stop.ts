import WorklogRepository from '../../WorklogRepository';
import { NextApiRequest, NextApiResponse } from 'next';

export default (req: NextApiRequest, res: NextApiResponse) => {
  const unfinished = WorklogRepository.getFirstUnfinished();
  if (!unfinished) {
    return res.status(409).end();
  }
  unfinished.end = new Date;
  WorklogRepository.save(unfinished);

  res.json(unfinished);
}
