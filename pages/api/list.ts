import WorklogRepository from '../../WorklogRepository';
import { NextApiRequest, NextApiResponse } from 'next';

export default (req: NextApiRequest, res: NextApiResponse) => {
  res.json(WorklogRepository.get());
}
