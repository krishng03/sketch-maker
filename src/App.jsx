import React, { useRef, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Handlebars from "handlebars";
import "./App.css";
import config from "./config.json";

export default function App() {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [headerHeight, setHeaderHeight] = useState(25);
  const [footerHeight, setFooterHeight] = useState(15);

  const [headerText, setHeaderText] = useState("");
  const [mainText, setMainText] = useState("");
  const [footerText, setFooterText] = useState("");

  const handleBarFunc = () => {
    const data = {
      businessDetails: {
        businessName: "SweetTreats Bakers",
        ownerName: "Priya Sharma",
        email: "contact@sweettreats.in",
        phone: "+91-9876543210",
        address: {
          street: "12 MG Road",
          city: "Pune",
          state: "Maharashtra",
          zip: "411001",
          country: "India",
        },
        gstNumber: "27PRYSH1234B1Z6",
        businessType: "Bakery & Confectionery",
      },
      items: [
        {
          itemId: "ITM001",
          name: "Chocolate Truffle Cake",
          type: "Product",
          category: "Cakes",
          rate: 700,
          unit: "Kg",
          taxPercentage: 5,
        },
        {
          itemId: "ITM002",
          name: "Designer Birthday Cake",
          type: "Product",
          category: "Cakes",
          rate: 1200,
          unit: "Kg",
          taxPercentage: 5,
        },
        {
          itemId: "ITM003",
          name: "Eggless Muffins (Pack of 6)",
          type: "Product",
          category: "Snacks",
          rate: 250,
          unit: "Pack",
          taxPercentage: 5,
        },
      ],
      parties: [
        {
          partyId: "PTY001",
          name: "Khandelwal Events",
          type: "Customer",
          contact: {
            email: "khandelwalevents@gmail.com",
            phone: "+91-9822123456",
          },
          address: {
            street: "45 Shaniwar Peth",
            city: "Pune",
            state: "Maharashtra",
            zip: "411030",
            country: "India",
          },
          gstNumber: "27KHNDE1234A1Z2",
        },
        {
          partyId: "PTY002",
          name: "FreshBake Supplies",
          type: "Vendor",
          contact: {
            email: "sales@freshbake.in",
            phone: "+91-9898123456",
          },
          address: {
            street: "203 Industrial Area",
            city: "Mumbai",
            state: "Maharashtra",
            zip: "400001",
            country: "India",
          },
          gstNumber: "27FRSHB1234T1Z7",
        },
      ],
      transactions: [
        {
          transactionId: "TXN001",
          type: "Invoice",
          date: "2025-05-01",
          partyId: "PTY001",
          items: [
            {
              itemId: "ITM001",
              quantity: 2,
              rate: 700,
            },
            {
              itemId: "ITM002",
              quantity: 1,
              rate: 1200,
            },
            {
              itemId: "ITM003",
              quantity: 3,
              rate: 250,
            },
          ],
          totalAmount: 3350,
          taxAmount: 167.5,
          grandTotal: 3517.5,
          paymentStatus: "Paid",
        },
        {
          transactionId: "TXN002",
          type: "Purchase",
          date: "2025-05-03",
          partyId: "PTY002",
          items: [
            {
              itemId: "ITM003",
              quantity: 20,
              rate: 200,
            },
            {
              itemId: "ITM001",
              quantity: 10,
              rate: 600,
            },
          ],
          totalAmount: 10000,
          taxAmount: 500,
          grandTotal: 10500,
          paymentStatus: "Pending",
        },
      ],
    };

    const transactionIndex = Math.floor(Math.random() * 2);
    const transaction = data.transactions[transactionIndex];
    const customer = data.parties.find(
      (party) => party.partyId === transaction.partyId
    );
    const business = data.businessDetails;

    const items = transaction.items.map((item) => {
      const itemDetails = data.items.find((i) => i.itemId === item.itemId);
      return {
        item: itemDetails.name,
        description: `${itemDetails.type} - ${itemDetails.category}`,
        quantity: item.quantity,
        price: `${item.rate.toFixed(2)}`,
        total: `${(item.quantity * item.rate).toFixed(2)}`,
      };
    });

    const templateData = {
      businessDetails: {
        businessName: business.businessName,
        ownerName: business.ownerName,
        email: business.email,
        phone: business.phone,
        address: {
          street: business.address.street,
          city: business.address.city,
          state: business.address.state,
          zip: business.address.zip,
          country: business.address.country,
        },
        gstNumber: business.gstNumber,
        businessType: business.businessType,
      },
      invoiceNumber: transaction.transactionId,
      date: transaction.date,
      customer: {
        name: customer.name,
        address: {
          street: customer.address.street,
          city: customer.address.city,
          state: customer.address.state,
          zip: customer.address.zip,
        },
        email: customer.contact.email,
        phone: customer.contact.phone,
        gst: customer.gstNumber,
      },
      items: items,
      subtotal: transaction.totalAmount.toFixed(2),
      tax: transaction.taxAmount.toFixed(2),
      total: transaction.grandTotal.toFixed(2),
      paymentStatus: transaction.paymentStatus,
    };

    const templateSource =
      document.getElementById("invoice-template").innerHTML;

    const template = Handlebars.compile(templateSource);

    const renderedHtml = template(templateData);

    document.getElementById("newTemplate").innerHTML = renderedHtml;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 500;
    canvas.height = 380;

    const context = canvas.getContext("2d");
    context.lineCap = "round";
    context.strokeStyle = "black";
    context.lineWidth = 2;
    contextRef.current = context;

    const icon = new window.Image();
    icon.onload = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      const iconWidth = 64;
      const iconHeight = 64;
      context.drawImage(
        icon,
        (canvas.width - iconWidth) / 2,
        100,
        iconWidth,
        iconHeight
      );
      context.font = "16px Segoe UI";
      context.textAlign = "center";
      context.fillText("Upload Image", canvas.width / 2, 160 + iconHeight);
    };
    icon.src = "/upload.png";
  }, []);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFile(file);
    const img = new Image();
    img.onload = () => {
      contextRef.current.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      contextRef.current.drawImage(
        img,
        0,
        0,
        canvasRef.current.width - 0,
        canvasRef.current.height - 0
      );
    };
    img.src = URL.createObjectURL(file);
  };

  const getSchema = async () => {
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64Image = reader.result;
      setLoading(true);

      const userCommands = {
        headerHeightFromTop: headerHeight,
        footerHeightFromBottom: footerHeight,
        commandsForHeaderSectionElements: headerText,
        commandsForMainSectionElements: mainText,
        commandsForFooterSectionElements: footerText,
      }

      let text = `
          Invoice Sketch-to-HTML Converter
          You are an advanced AI specializing in converting hand-drawn invoice sketches to professional HTML and CSS code. Your task is to carefully analyze the sketch, identify all invoice components, and generate accurate, responsive code that matches the sketch layout.
          STEP 1: ANALYZE THE SKETCH SYSTEMATICALLY
          First, carefully analyze the entire sketch image to identify ALL components:

          Identify the invoice orientation (portrait or landscape)
          Locate the business header section (logo, business name, contact details)
          Find customer information section
          Identify invoice details (invoice #, date, payment status)
          Locate the items/services table structure
          Find totals section (subtotal, tax, total)
          Identify any footer elements (terms, notes, signature)
          Note any special design elements, borders, or sections

          STEP 2: CREATE STRUCTURED HTML+CSS
          Apply these requirements strictly:
          REQUIRED OUTPUT STRUCTURE:
          <style>
          /* All CSS goes here - NO INLINE STYLES */
          </style>
          <div class="invoice-container">
            <!-- All HTML goes here -->
          </div>
          HTML GUIDELINES:

          Use semantic HTML5 tags (header, section, table, footer, etc.)
          Create proper hierarchy with meaningful class names
          Structure elements exactly as positioned in the sketch
          Include ALL components identified in the sketch
          Always set logo src as './vyapar_logo.png'
          For items section, implement table structure with proper headers and Handlebars loop

          CSS GUIDELINES:

          Use CSS Flexbox for layout (NO Grid)
          Create responsive design with media queries
          Use professional color scheme with proper contrast
          Apply appropriate spacing between sections
          NO inline styles - all styling in the <style> section
          Match the visual weight and prominence of elements as shown in the sketch
          Use appropriate font sizing to maintain hierarchy
          Match orientation (portrait/landscape) from the sketch in your layout design

          STEP 3: IMPLEMENT HANDLEBARS PLACEHOLDERS
          Use EXACTLY these placeholder names from the provided JSON structure:
          json{
            "businessDetails": {
              "businessName": "{{businessDetails.businessName}}",
              "ownerName": "{{businessDetails.ownerName}}",
              "email": "{{businessDetails.email}}",
              "phone": "{{businessDetails.phone}}",
              "address": {
                "street": "{{businessDetails.address.street}}",
                "city": "{{businessDetails.address.city}}",
                "state": "{{businessDetails.address.state}}",
                "zip": "{{businessDetails.address.zip}}",
                "country": "{{businessDetails.address.country}}"
              },
              "gstNumber": "{{businessDetails.gstNumber}}",
              "businessType": "{{businessDetails.businessType}}"
            },
            "invoiceNumber": "{{invoiceNumber}}",
            "date": "{{date}}",
            "customer": {
              "name": "{{customer.name}}",
              "address": {
                "street": "{{customer.address.street}}",
                "city": "{{customer.address.city}}",
                "state": "{{customer.address.state}}",
                "zip": "{{customer.address.zip}}"
              },
              "email": "{{customer.email}}",
              "phone": "{{customer.phone}}",
              "gst": "{{customer.gst}}"
            },
            "items": [
              "{{#each items}}",
              {
                "description": "{{description}}",
                "quantity": "{{quantity}}",
                "price": "{{price}}",
                "total": "{{total}}"
              },
              "{{/each}}"
            ],
            "subtotal": "{{subtotal}}",
            "tax": "{{tax}}",
            "total": "{{total}}",
            "paymentStatus": "{{paymentStatus}}"
          }
          ITEMS SECTION HANDLING
          For the items/services table:

          Implement proper Handlebars loop: {{#each items}}...{{/each}}
          Include table headers: Description, Quantity, Price, Total
          Style to match sketch appearance

          USER-PROVIDED COMMANDS:
          ${userCommands}
          This includes percentage values for header and footer section. If any value is 0, consider header or footer does not exist, merge that section in main section.
          This also includes some user provided commands for elements detected in header, main, and footer sections
          This has been taken to provide a sketch which further enhances the output and makes better result to user. Hope it helps in making better HTML + CSS results.

          BEFORE COMPLETING
          Review your output and check:

          Have you included ALL components visible in the sketch?
          Does the layout match the sketch's orientation and component positioning?
          Are all Handlebars placeholders implemented correctly?
          Does the HTML structure properly represent the visual hierarchy in the sketch?
          Is the CSS complete with appropriate styling for all elements?

          Only return the complete HTML and CSS code with the structure specified above - no explanations or additional text.
        `;

      const apiKey = config.API_KEY;

      try {
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o",
            messages: [
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text: text,
                  },
                  {
                    type: "image_url",
                    image_url: {
                      url: base64Image,
                    },
                  },
                ],
              },
            ],
            temperature: 0.3,
          }),
        });

        let data = await res.json();

        if (data.choices && data.choices.length > 0) {
          data = data.choices[0].message.content;
          data = data.replace(/^[\s\S]*?(?=<style)/, "");
          const idx = data.lastIndexOf("</div>");
          if (idx !== -1) data = data.slice(0, idx + 6) + "</script>";
          const list = data.split("</style>");
          list[1] =
            '</style><script id="invoice-template" type="text/x-handlebars-template">' +
            list[1];
          data = list.join(" ");
          const templateContaier = document.getElementById("template");
          templateContaier.innerHTML = data;
          handleBarFunc();
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const setFooter = (e) => {
    if (e.target.value <= 40) {
      setFooterHeight(e.target.value);
    }
  };

  const setHeader = (e) => {
    if (e.target.value <= 40) {
      setHeaderHeight(e.target.value);
    }
  };

  return (
    <div className="fontdecl">
      <div className="header">
        <h2 className="title">sketch2template</h2>
        <p className="description">
          Upload a sketch or sample invoice image to preview and generate a
          template.
        </p>
      </div>
      <div className="toolbox">
        <div>
          The metadata to the right assist to the generation of invoices, though
          optional, filling it gives better result
        </div>
        <div className="formContainer">
          <div className="toolboxForm">
            <label>
              Header (%):
              <input
                type="number"
                min="0"
                max="40"
                placeholder="25%"
                onBlur={setHeader}
              />
            </label>
            <label>
              Footer (%):
              <input
                type="number"
                min="0"
                max="40"
                placeholder="15%"
                onBlur={setFooter}
              />
            </label>
          </div>
          <div className="toolboxForm2">
            <div>Enter comma separated values:</div>
            <div>
              <label>
                Header Section Commands
                <textarea
                  onBlur={(e) => setHeaderText(e.target.value)}
                  placeholder="Put GSTIN number here,..."
                  cols={25}
                  rows={4}
                ></textarea>
              </label>
              <label>
                Main Section Commands
                <textarea
                  onBlur={(e) => setMainText(e.target.value)}
                  placeholder="Make item table here,..."
                  cols={25}
                  rows={4}
                ></textarea>
              </label>
              <label>
                Footer Section Commands
                <textarea
                  onBlur={(e) => setFooterText(e.target.value)}
                  placeholder="Write 'Thank You! Visit Again in center', Put Signature in rightmost part, ..."
                  cols={25}
                  rows={4}
                ></textarea>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="main">
        <div className="app-container">
          <div className="canvas-wrapper">
            <canvas ref={canvasRef} id="canvas" />
          </div>

          <div className="controls">
            <div className="upload-clear">
              <input
                type="file"
                accept="image/*"
                className="file-input"
                onChange={handleUpload}
              />
            </div>

            <div className="button-group">
              <button onClick={() => getSchema()} className="btn-action">
                For Sketch
              </button>
              {/* <button onClick={() => getSchema(false)} className="btn-action">
            For Sample Invoice
            </button> */}
            </div>

            {loading && (
              <div className="loading-indicator">
                <div className="spinner" />
                <span>Generating template...</span>
              </div>
            )}
          </div>
        </div>
        <div className="preview" style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              top: `${headerHeight}%`,
              width: "92%",
              borderTop: "2px dotted red",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: `${footerHeight}%`,
              width: "92%",
              borderTop: "2px dotted blue",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "50%",
              fontWeight: "200",
              fontFamily: "Segoe UI",
              fontSize: "12px",
              marginLeft: "125px",
            }}
          >
            This shows the size of header, main, and footer section
          </div>
        </div>
      </div>
    </div>
  );
}
