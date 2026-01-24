# ChainwindCSS

ChainwindCSS is a visual tool that helps you generate Tailwind CSS code through a node-based interface. Connect nodes, draw frames, and instantly get the corresponding Tailwind CSS code.

This example has been created using the tldraw SDK, offering features similar to [computer.tldraw.com](https://computer.tldraw.com).

## 🌟 Features

- Node-based visual interface
- Real-time Tailwind CSS code generation
- Support for text, frames, and image inputs
- Interactive design workflow

## 🛠 Prerequisites

Before you begin, ensure you have:

- Node.js installed
- An OpenAI API key
  - Create `.env` file in the root directory
  - Add your OpenAI API key: `OPENAI_API_KEY=your_api_key_here`

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables (see Prerequisites)
4. Run the development server:
   ```bash
   npm run dev
   ```

## 📝 How to Use

1. Connect text nodes to the Tailwind generate node using arrows
2. Draw your desired layout using Frames and connect them to the Tailwind generate node
3. Connect images to the Tailwind generate node for image-based generation

<img width="1132" alt="usage" src="https://github.com/user-attachments/assets/10c0a785-75c8-42cb-89df-8b8f516d4df5" />

## 📁 Project Structure

```
chainwindcss/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── generate/
│   │   │       └── tailwind/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── draw/
│   │   │   ├── code-preview.tsx
│   │   │   ├── drawing-canvas.tsx
│   │   │   ├── error-boundary.tsx
│   │   │   └── generate-box.tsx
│   │   ├── svg/
│   │   ├── tiptap/
│   │   │   └── Tiptap.tsx
│   │   └── tldraw/
│   │       ├── tailwindShape.tsx
│   │       └── textInputShape.tsx
│   └── tldraw-utils/
│       └── custom.ts
├── public/
│   ├── globe.svg
│   └── file.svg
├── .env
├── next.config.js
├── package.json
├── postcss.config.mjs
└── tsconfig.json
```

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.
