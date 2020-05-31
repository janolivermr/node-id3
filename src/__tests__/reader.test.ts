import { Reader } from '../reader';
import * as fs from 'fs';
import * as path from 'path';

const samplePath = path.join(__dirname, 'sample.mp3');

it('gets single raw tag', () => {
  const buf = fs.readFileSync(samplePath);
  const tags = Reader.getRawTags(buf);
  expect(tags).toHaveLength(1);
});

it('gets multiple raw tags', () => {
  const buf = Buffer.from([
    0x00,
    0x49,
    0x44,
    0x33,
    0x04,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
    0x02,
    0x00,
    0x00,
    0x49,
    0x44,
    0x33,
    0x04,
    0x00,
    0x00,
    0x00,
    0x00,
    0x73,
    0x02,
  ]);
  const tags = Reader.getRawTags(buf);
  expect(tags).toHaveLength(2);
});
