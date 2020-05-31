import { getFourByteNumber } from './helpers';

export class Reader {
  public static getRawTags(buf: Buffer): Buffer[] {
    let tagStart = buf.indexOf('ID3'); // Should be 0, or -1 if no tags are present
    const tags = [];
    while (tagStart !== -1) {
      const length = getFourByteNumber(buf, tagStart + 6);
      const tagEnd = tagStart + 10 + length;
      tags.push(buf.slice(tagStart, tagEnd));
      tagStart = buf.indexOf('ID3', tagEnd);
    }
    return tags;
  }
}
