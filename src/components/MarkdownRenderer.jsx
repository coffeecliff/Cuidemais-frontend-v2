// Lightweight markdown renderer — covers the subset ChatIA's mock responses use
// (headings, bold/italic, inline code, fenced code blocks, lists, links) without a dependency.

function renderInline(text, keyPrefix) {
  const parts = text.split(/(\*\*.+?\*\*|\*.+?\*|`.+?`|\[.+?\]\(.+?\))/g).filter(Boolean);

  return parts.map((part, i) => {
    const key = `${keyPrefix}-${i}`;
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={key} className="font-semibold text-dark">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={key} className="rounded bg-dark/5 px-1.5 py-0.5 text-[0.85em] font-mono text-dark">
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**')) {
      return (
        <em key={key} className="italic">
          {part.slice(1, -1)}
        </em>
      );
    }
    const linkMatch = part.match(/^\[(.+?)\]\((.+?)\)$/);
    if (linkMatch) {
      return (
        <a key={key} href={linkMatch[2]} target="_blank" rel="noreferrer" className="text-light underline underline-offset-2 hover:text-medium">
          {linkMatch[1]}
        </a>
      );
    }
    return part;
  });
}

export function MarkdownRenderer({ content = '', className = '' }) {
  const lines = content.split('\n');
  const blocks = [];
  let listBuffer = [];
  let codeBuffer = null;

  function flushList() {
    if (listBuffer.length) {
      blocks.push(
        <ul key={`list-${blocks.length}`} className="list-disc pl-5 space-y-1 my-2">
          {listBuffer.map((item, i) => (
            <li key={i} className="text-sm leading-relaxed">
              {renderInline(item, `li-${blocks.length}-${i}`)}
            </li>
          ))}
        </ul>,
      );
      listBuffer = [];
    }
  }

  lines.forEach((line, idx) => {
    if (line.trimStart().startsWith('```')) {
      if (codeBuffer === null) {
        codeBuffer = [];
      } else {
        blocks.push(
          <pre key={`code-${idx}`} className="my-2 overflow-x-auto rounded-xl bg-dark text-white text-xs p-4 font-mono leading-relaxed">
            <code>{codeBuffer.join('\n')}</code>
          </pre>,
        );
        codeBuffer = null;
      }
      return;
    }
    if (codeBuffer !== null) {
      codeBuffer.push(line);
      return;
    }

    if (/^\s*[-*]\s+/.test(line)) {
      listBuffer.push(line.replace(/^\s*[-*]\s+/, ''));
      return;
    }
    flushList();

    if (/^###\s+/.test(line)) {
      blocks.push(
        <h4 key={idx} className="font-semibold text-dark mt-3 mb-1">
          {renderInline(line.replace(/^###\s+/, ''), `h4-${idx}`)}
        </h4>,
      );
    } else if (/^##\s+/.test(line)) {
      blocks.push(
        <h3 key={idx} className="font-semibold text-dark text-base mt-3 mb-1">
          {renderInline(line.replace(/^##\s+/, ''), `h3-${idx}`)}
        </h3>,
      );
    } else if (line.trim() === '') {
      blocks.push(<div key={idx} className="h-2" />);
    } else {
      blocks.push(
        <p key={idx} className="text-sm leading-relaxed">
          {renderInline(line, `p-${idx}`)}
        </p>,
      );
    }
  });
  flushList();

  return <div className={`space-y-1 ${className}`}>{blocks}</div>;
}
