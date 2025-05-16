import React, { useRef, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import SAMPLE_SCHEMA from './sample_schema.json';
import TemplateRenderer from './TemplateRenderer';

export default function App() {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [file, setFile] = useState(null);
  const [schema, setSchema] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 500;
    canvas.height = 300;
    canvas.style.border = '1px solid #ccc';

    const context = canvas.getContext('2d');
    context.lineCap = 'round';
    context.strokeStyle = 'black';
    context.lineWidth = 2;
    contextRef.current = context;
  }, []);

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  const finishDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFile(file);
    const img = new Image();
    img.onload = () => {
      contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      contextRef.current.drawImage(img, 1, 1, canvasRef.current.width-1, canvasRef.current.height-1);
    };
    img.src = URL.createObjectURL(file);
  };

  const clearCanvas = () => {
    contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  }

  const getSchema = () => {
    if(!file) return;

    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64Image = reader.result.split(",")[1];

      const apiKey = "AIzaSyDJws8_Q1umDtNdxv41xR7eerMyfdb2dUM";
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

      const requestBody = {
        contents: [
          {
            parts: [
              {
                text: `
                Act as a profession sketch to template generator model, analyze the image and give structured JSON
                Below is the type definition for the template I want from you, stick to this while generting output:
                type Template = {
                  page: {
                    width: number;
                    height: number;
                    unit: "pt";
                  };
                  elements: {
                    id: string;
                    type: "image" | "text" | "table";
                    bbox: {
                      x: number;
                      y: number;
                      width: number;
                      height: number;
                    };
                    properties:
                      | {
                          // For image
                          placeholder: string;
                          rotation: number;
                        }
                      | {
                          // For text
                          fontSize: number;
                          fontWeight: string;
                          placeholder: string;
                        };
                      | {
                        columns:
                          { header: string, "width": number, "placeholder": string }[],
                          rowHeight: number,
                      }
                  }[];
                };
                Below is example of one such JSON schema I want from you:
                ${SAMPLE_SCHEMA}
                `
              },
              {
                inlineData: {
                  mimeType: file.type,
                  data: base64Image,
                },
              },
              {
                text: `
                Input: base64-encoded image
                Output: structured JSON, restrict to type defintion and correctly classify components in sketch and take time to generate JSON as given in example
                NOTES:
                1. do not write comments inside/outside output JSON
                2. Identify shapes such as rectangles, squares to make table element
                `,
              },
            ],
          },
        ],
      };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      let data = await res.json();
      data = data.candidates?.[0]?.content?.parts?.[0]?.text;
      console.log(data);
      data = data.replace('```json\n', '').split('```')[0];
      console.log('Schema data: ', data);
      setSchema(JSON.parse(data))
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Sketch & Upload Canvas</h2>
      <div>
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={finishDrawing}
          onMouseLeave={finishDrawing}
        />
      </div>
      <div style={{ marginTop: '10px' }}>
        <input type="file" accept="image/*" onChange={handleUpload} />
        <button onClick={clearCanvas} style={{ marginLeft: '10px' }}>Clear Canvas</button>
        <button onClick={getSchema} style={{ marginLeft: '10px' }}>Get Schema</button>
      </div>
      {schema &&
        <TemplateRenderer schema={schema} />
      }
    </div>
  );
}
