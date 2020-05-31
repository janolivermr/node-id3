export function getFourByteNumber(buffer: Buffer, offset: number): number {
  // tslint:disable-next-line: no-bitwise
  return (buffer[offset] << 21) + (buffer[offset + 1] << 14) + (buffer[offset + 2] << 7) + buffer[offset + 3];
}
