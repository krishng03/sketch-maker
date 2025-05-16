import React from 'react';

function resolvePlaceholder(placeholder) {
  return placeholder.replace(/\n/g, '<br />');
}

export default function TemplateRenderer({ schema }) {
const { width, height, unit } = schema.page;
  return (
    <div
      style={{
        position: 'relative',
        width: `${width}${unit}`,
        height: `${height}${unit}`,
        border: '1px solid #ccc',
        fontFamily: 'sans-serif',
      }}
    >
      {schema.elements.map(el => {
        const { x, y, width: w, height: h } = el.bbox;
        const styleBase = {
          position: 'absolute',
          left: `${x}${unit}`,
          top: `${y}${unit}`,
          width: `${w}${unit}`,
          height: `${h}${unit}`,
          overflow: 'hidden',
        };

        if (el.type === 'text') {
          return (
            <div
              key={el.id}
              style={{
                ...styleBase,
                fontSize: el.properties.fontSize,
                fontWeight: el.properties.fontWeight || 'normal',
                whiteSpace: 'pre-wrap',
              }}
              dangerouslySetInnerHTML={{
                __html: resolvePlaceholder(el.properties.placeholder),
              }}
            />
          );
        }

        if (el.type === 'image') {
          // For simplicity, we use a placeholder arrow (could be a base64 image or actual file path)
          const arrow = 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Red_Arrow_Down.svg';
          return (
            <img
              key={el.id}
              src={arrow}
              alt="arrow"
              style={{
                ...styleBase,
                objectFit: 'contain',
                transform: `rotate(${el.properties.rotation || 0}deg)`,
              }}
            />
          );
        }

        if (el.type === 'table') {
          // Render a simple table using the properties
          const { columns = [], rowHeight = 20 } = el.properties || {};
          return (
            <table
              key={el.id}
              style={{
                ...styleBase,
                borderCollapse: 'collapse',
                background: '#fff',
                fontSize: 12,
              }}
            >
              <thead>
                <tr>
                  {columns.map((col, idx) => (
                    <th
                      key={idx}
                      style={{
                        border: '1px solid #aaa',
                        padding: '2px 4px',
                        minWidth: `${col.width || 40}px`,
                        background: '#f5f5f5',
                      }}
                    >
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {columns.map((col, idx) => (
                    <td
                      key={idx}
                      style={{
                        border: '1px solid #aaa',
                        padding: '2px 4px',
                        minWidth: `${col.width || 40}px`,
                        height: `${rowHeight}px`,
                        color: '#888',
                        fontStyle: 'italic',
                      }}
                    >
                      {col.placeholder}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          );
        }

        return null;
      })}
    </div>
  );
}
