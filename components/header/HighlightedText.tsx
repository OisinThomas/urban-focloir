import React from 'react';

type HighlightedTextProps = {
  text: string;
  highlight: string;
};

export default function HighlightedText({ text, highlight }: HighlightedTextProps) {
  if (!highlight.trim()) {
    return <span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>;
  }

  const regex = new RegExp(`(${highlight})`, 'gi');
  const parts = text.split(regex);

  return (
    <span style={{ whiteSpace: 'pre-wrap' }}>
      {parts.map((part, index) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <span key={index} style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
            {part}
          </span>
        ) : (
          part
        )
      )}
    </span>
  );
}
