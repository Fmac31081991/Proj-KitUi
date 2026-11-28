/* zipper.js — escritor ZIP mínimo e sem dependências.
   KIT_ZIP monta o pacote com o método store (sem compressão).
   KIT_ZIP_ASYNC usa DEFLATE quando o navegador oferece CompressionStream;
   é o caminho usado no ZIP exportado, que inclui milhares de SVGs. */
(function () {
  'use strict';

  const CRC_TABLE = (function () {
    const t = new Uint32Array(256);
    for (let n = 256 - 1; n >= 0; n--) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      t[n] = c >>> 0;
    }
    return t;
  })();

  function crc32(buf) {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
  }

  function dosTime(d) {
    return ((d.getHours() << 11) | (d.getMinutes() << 5) | ((d.getSeconds() / 2) | 0)) & 0xffff;
  }
  function dosDate(d) {
    return (((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate()) & 0xffff;
  }

  /* file: { name, data } — payload já comprimido (ou os próprios dados),
     method: 0 (store) ou 8 (deflate), size: tamanho original. */
  function assemble(prepared) {
    const enc = new TextEncoder();
    const parts = [];
    const central = [];
    let offset = 0;
    const now = new Date();

    prepared.forEach((file) => {
      const nameBytes = enc.encode(file.name);
      const payload = file.payload;
      const size = file.size;

      const local = new Uint8Array(30 + nameBytes.length);
      const lv = new DataView(local.buffer);
      lv.setUint32(0, 0x04034b50, true);
      lv.setUint16(4, 20, true);
      lv.setUint16(6, 0x0800, true);
      lv.setUint16(8, file.method, true);
      lv.setUint16(10, dosTime(now), true);
      lv.setUint16(12, dosDate(now), true);
      lv.setUint32(14, file.crc, true);
      lv.setUint32(18, payload.length, true);
      lv.setUint32(22, size, true);
      lv.setUint16(26, nameBytes.length, true);
      lv.setUint16(28, 0, true);
      local.set(nameBytes, 30);
      parts.push(local, payload);

      const cd = new Uint8Array(46 + nameBytes.length);
      const cv = new DataView(cd.buffer);
      cv.setUint32(0, 0x02014b50, true);
      cv.setUint16(4, 20, true);
      cv.setUint16(6, 20, true);
      cv.setUint16(8, 0x0800, true);
      cv.setUint16(10, file.method, true);
      cv.setUint16(12, dosTime(now), true);
      cv.setUint16(14, dosDate(now), true);
      cv.setUint32(16, file.crc, true);
      cv.setUint32(20, payload.length, true);
      cv.setUint32(24, size, true);
      cv.setUint16(28, nameBytes.length, true);
      cv.setUint32(42, offset, true);
      cd.set(nameBytes, 46);
      central.push(cd);

      offset += local.length + payload.length;
    });

    const cdSize = central.reduce((sum, c) => sum + c.length, 0);
    const eocd = new Uint8Array(22);
    const ev = new DataView(eocd.buffer);
    ev.setUint32(0, 0x06054b50, true);
    ev.setUint16(8, prepared.length, true);
    ev.setUint16(10, prepared.length, true);
    ev.setUint32(12, cdSize, true);
    ev.setUint32(16, offset, true);

    const out = new Uint8Array(offset + cdSize + 22);
    let p = 0;
    parts.forEach((part) => {
      out.set(part, p);
      p += part.length;
    });
    central.forEach((part) => {
      out.set(part, p);
      p += part.length;
    });
    out.set(eocd, p);
    return out;
  }

  function prepare(files) {
    const enc = new TextEncoder();
    return files.map((file) => {
      const data = typeof file.data === 'string' ? enc.encode(file.data) : file.data;
      return { name: file.name, payload: data, size: data.length, method: 0, crc: crc32(data) };
    });
  }

  function zip(files) {
    return assemble(prepare(files));
  }

  async function zipAsync(files) {
    const prepared = prepare(files);
    if (typeof CompressionStream === 'undefined') return assemble(prepared);

    for (const file of prepared) {
      if (file.size < 512) continue;
      try {
        const stream = new Blob([file.payload]).stream()
          .pipeThrough(new CompressionStream('deflate-raw'));
        const packed = new Uint8Array(await new Response(stream).arrayBuffer());
        if (packed.length < file.payload.length) {
          file.payload = packed;
          file.method = 8;
        }
      } catch (e) {
        /* Store é sempre válido; a compressão é apenas uma otimização. */
      }
    }
    return assemble(prepared);
  }

  window.KIT_ZIP = zip;
  window.KIT_ZIP_ASYNC = zipAsync;
})();
