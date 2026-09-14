import "server-only";

/**
 * Minimal, dependency-free dimension reader for exactly the 3 formats
 * uploadMedia accepts (JPEG/PNG/WebP) — deliberately not a general-purpose
 * image library. An npm package considered for this (`image-size`) has an
 * unpatched high-severity DoS vulnerability in its ICNS/JXL/HEIF parsers;
 * since dimension detection runs on user-uploaded file content, pulling in
 * a parser for formats this app doesn't even accept was a real attack
 * surface for no benefit. This only ever reads the first few dozen bytes
 * of a known-good format's header, never routes through format-sniffing
 * logic for anything else.
 */
export function getImageDimensions(buffer: Buffer, contentType: string): { width: number; height: number } | null {
  try {
    if (contentType === "image/png") return readPngDimensions(buffer);
    if (contentType === "image/jpeg") return readJpegDimensions(buffer);
    if (contentType === "image/webp") return readWebpDimensions(buffer);
    return null;
  } catch {
    return null;
  }
}

function readPngDimensions(buf: Buffer): { width: number; height: number } | null {
  if (buf.length < 24) return null;
  const isPng = buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47;
  if (!isPng) return null;
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

function readJpegDimensions(buf: Buffer): { width: number; height: number } | null {
  if (buf.length < 4 || buf[0] !== 0xff || buf[1] !== 0xd8) return null;
  let offset = 2;
  while (offset + 9 < buf.length) {
    if (buf[offset] !== 0xff) return null;
    const marker = buf[offset + 1];
    const isSOF = (marker >= 0xc0 && marker <= 0xc3) || (marker >= 0xc5 && marker <= 0xc7) || (marker >= 0xc9 && marker <= 0xcb) || (marker >= 0xcd && marker <= 0xcf);
    if (isSOF) {
      const height = buf.readUInt16BE(offset + 5);
      const width = buf.readUInt16BE(offset + 7);
      return { width, height };
    }
    const segmentLength = buf.readUInt16BE(offset + 2);
    offset += 2 + segmentLength;
  }
  return null;
}

function readWebpDimensions(buf: Buffer): { width: number; height: number } | null {
  if (buf.length < 30) return null;
  const isRiff = buf.toString("ascii", 0, 4) === "RIFF";
  const isWebp = buf.toString("ascii", 8, 12) === "WEBP";
  if (!isRiff || !isWebp) return null;
  const format = buf.toString("ascii", 12, 16);
  if (format === "VP8 ") {
    return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
  }
  if (format === "VP8L") {
    const bits = buf.readUInt32LE(21);
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
  }
  if (format === "VP8X") {
    const width = (buf[24] | (buf[25] << 8) | (buf[26] << 16)) + 1;
    const height = (buf[27] | (buf[28] << 8) | (buf[29] << 16)) + 1;
    return { width, height };
  }
  return null;
}
