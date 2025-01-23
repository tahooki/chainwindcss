import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { EditorProvider } from "@tiptap/react";
import {
  BaseBoxShapeUtil,
  DefaultColorStyle,
  DefaultFillStyle,
  DefaultSizeStyle,
  HTMLContainer,
  T,
  TLBaseShape,
  TLDefaultColorStyle,
  TLDefaultFillStyle,
  TLDefaultSizeStyle,
  useDefaultColorTheme,
  useEditor,
} from "tldraw";

export type TextInputShape = TLBaseShape<
  "textInput",
  {
    w: number;
    h: number;
    size: TLDefaultSizeStyle;
    color: TLDefaultColorStyle;
    fill: TLDefaultFillStyle;
    text: string;
  }
>;

export class TextInputShapeUtil extends BaseBoxShapeUtil<TextInputShape> {
  static type = "textInput" as const;

  static override props = {
    w: T.number,
    h: T.number,
    color: DefaultColorStyle,
    fill: DefaultFillStyle,
    text: T.string,
    size: DefaultSizeStyle,
  };

  getDefaultProps() {
    return {
      color: "white" as const,
      fill: "solid" as const,
      text: "Hello, world!",
      size: "m" as const,
      w: 100,
      h: 100,
    };
  }

  component(shape: TextInputShape) {
    const theme = useDefaultColorTheme();
    const editor = useEditor();

    let fontSize = "24px"; // m
    switch (shape.props.size) {
      case "s":
        fontSize = "18px";
        break;
      case "m":
        fontSize = "24px";
        break;
      case "l":
        fontSize = "32px";
        break;
      case "xl":
        fontSize = "48px";
        break;
    }

    const backgroundColor = theme[shape.props.color].solid;
    let headerTextColor = "black";

    switch (shape.props.color) {
      case "black":
      case "red":
      case "blue":
      case "green":
      case "orange":
      case "violet":
        headerTextColor = "white";
        break;
    }

    return (
      <HTMLContainer id={shape.id}>
        <div
          className="rounded-[8px] border-[3px] border-black overflow-hidden flex flex-col text-[16px]"
          style={{
            width: shape.props.w,
            height: shape.props.h,
            fontFamily: "var(--tl-font-draw)",
          }}
        >
          {/* header */}
          <div
            className="flex gap-1 items-center px-3 min-h-[40px] bg-white border-b border-gray-200 cursor-move pointer-events-auto"
            style={{
              backgroundColor,
              color: headerTextColor,
            }}
          >
            <span className="material-symbols-outlined">drag_indicator</span>
            <h2>Text</h2>
          </div>

          {/* content */}
          <EditorProvider
            extensions={[Text, Document, Paragraph]}
            onUpdate={(params) => {
              editor.updateShape({
                id: shape.id,
                type: "textInput",
                props: {
                  text: params.editor.getText(),
                },
              });
            }}
            content={shape.props.text || "Hello World!"}
            editorContainerProps={{
              className:
                "text-gray-500 p-2 font-sans element flex-1 w-full h-full bg-white pointer-events-auto",
              style: {
                fontFamily: "var(--tl-font-draw)",
                fontSize,
              },
            }}
          ></EditorProvider>
        </div>
      </HTMLContainer>
    );
  }

  indicator(shape: TextInputShape) {
    return null;
  }
}
