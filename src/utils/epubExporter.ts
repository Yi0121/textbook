// utils/epubExporter.ts
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import type { EPUBMetadata, EPUBChapter } from '../types';

/**
 * EPUB 匯出工具
 * 將章節內容打包成 EPUB 格式並下載
 */

// EPUB 容器檔案（必須）
const CONTAINER_XML = `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`;

// 生成 content.opf（書籍元資料）
function generateContentOPF(metadata: EPUBMetadata, chapters: EPUBChapter[]): string {
    const now = new Date().toISOString();
    const manifestItems = chapters.map((_, i) =>
        `    <item id="chapter${i + 1}" href="chapter${i + 1}.xhtml" media-type="application/xhtml+xml"/>`
    ).join('\n');

    const spineItems = chapters.map((_, i) =>
        `    <itemref idref="chapter${i + 1}"/>`
    ).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="bookid">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="bookid">urn:uuid:${crypto.randomUUID()}</dc:identifier>
    <dc:title>${escapeXml(metadata.title)}</dc:title>
    <dc:creator>${escapeXml(metadata.author)}</dc:creator>
    <dc:language>zh-TW</dc:language>
    <meta property="dcterms:modified">${now.slice(0, 19)}Z</meta>
  </metadata>
  <manifest>
    <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>
    <item id="css" href="style.css" media-type="text/css"/>
${manifestItems}
  </manifest>
  <spine>
    <itemref idref="nav"/>
${spineItems}
  </spine>
</package>`;
}

// 生成導航頁面
function generateNavXHTML(chapters: EPUBChapter[]): string {
    const navItems = chapters.map((ch, i) =>
        `        <li><a href="chapter${i + 1}.xhtml">${escapeXml(ch.title)}</a></li>`
    ).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
<head>
  <title>目錄</title>
  <link rel="stylesheet" type="text/css" href="style.css"/>
</head>
<body>
  <nav epub:type="toc">
    <h1>目錄</h1>
    <ol>
${navItems}
    </ol>
  </nav>
</body>
</html>`;
}

// 生成章節頁面
function generateChapterXHTML(chapter: EPUBChapter): string {
    const content = typeof chapter.content === 'string'
        ? chapter.content
        : JSON.stringify(chapter.content);

    return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>${escapeXml(chapter.title)}</title>
  <link rel="stylesheet" type="text/css" href="style.css"/>
</head>
<body>
  <h1>${escapeXml(chapter.title)}</h1>
  <div class="chapter-content">
    ${content}
  </div>
</body>
</html>`;
}

// 基本樣式
const STYLE_CSS = `
body {
  font-family: "PingFang TC", "Microsoft JhengHei", "Noto Sans TC", sans-serif;
  line-height: 1.8;
  padding: 1em 2em;
  max-width: 800px;
  margin: 0 auto;
}
h1 {
  font-size: 1.8em;
  color: #1e3a5f;
  border-bottom: 2px solid #4f46e5;
  padding-bottom: 0.3em;
  margin-bottom: 1em;
}
h2 {
  font-size: 1.4em;
  color: #374151;
  margin-top: 1.5em;
}
p {
  margin: 0.8em 0;
  text-align: justify;
}
img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 1em auto;
}
.chapter-content {
  font-size: 1.1em;
}
`;

// 轉義 XML 特殊字元
function escapeXml(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

/**
 * 匯出 EPUB 檔案
 */
export async function exportEPUB(
    metadata: EPUBMetadata,
    chapters: EPUBChapter[]
): Promise<void> {
    const zip = new JSZip();

    // 1. 添加 mimetype（必須是第一個檔案，且不壓縮）
    zip.file('mimetype', 'application/epub+zip', { compression: 'STORE' });

    // 2. 添加 META-INF/container.xml
    zip.file('META-INF/container.xml', CONTAINER_XML);

    // 3. 添加 OEBPS 內容
    const oebps = zip.folder('OEBPS');
    if (!oebps) throw new Error('Failed to create OEBPS folder');

    // 內容描述檔
    oebps.file('content.opf', generateContentOPF(metadata, chapters));

    // 導航
    oebps.file('nav.xhtml', generateNavXHTML(chapters));

    // 樣式
    oebps.file('style.css', STYLE_CSS);

    // 章節內容
    chapters.forEach((chapter, index) => {
        oebps.file(`chapter${index + 1}.xhtml`, generateChapterXHTML(chapter));
    });

    // 4. 生成並下載
    const blob = await zip.generateAsync({
        type: 'blob',
        mimeType: 'application/epub+zip',
        compression: 'DEFLATE',
        compressionOptions: { level: 9 }
    });

    const filename = `${metadata.title || 'textbook'}.epub`;
    saveAs(blob, filename);

    console.log(`✅ EPUB 匯出成功: ${filename}`);
}

/**
 * 從編輯器內容匯出 EPUB
 */
export async function exportFromEditor(
    title: string,
    author: string,
    htmlContent: string
): Promise<void> {
    const metadata: EPUBMetadata = {
        title: title || '未命名文件',
        author: author || '未知作者',
    };

    // 將單一 HTML 內容作為一個章節
    const chapters: EPUBChapter[] = [{
        id: 'main',
        title: title || '內容',
        content: htmlContent,
        order: 0,
    }];

    await exportEPUB(metadata, chapters);
}
