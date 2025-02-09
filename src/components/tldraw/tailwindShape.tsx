import { ImageInput } from "@/app/api/generate/tailwind/route";
import { handleExportBase64 } from "@/tldraw-utils/custom";
import axios from "axios";
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
  TLShape,
  useDefaultColorTheme,
  useEditor,
} from "tldraw";

export type TailwindShape = TLBaseShape<
  "generate",
  {
    w: number;
    h: number;
    size: TLDefaultSizeStyle;
    color: TLDefaultColorStyle;
    fill: TLDefaultFillStyle;
    content: string;
    isCodeView: boolean;
    isLoading: boolean;
    onClick?: () => void;
  }
>;

export class TailwindShapeUtil extends BaseBoxShapeUtil<TailwindShape> {
  static type = "generate" as const;

  static override props = {
    w: T.number,
    h: T.number,
    color: DefaultColorStyle,
    fill: DefaultFillStyle,
    content: T.string,
    size: DefaultSizeStyle,
    isCodeView: T.boolean,
    isLoading: T.boolean,
  };

  getDefaultProps() {
    return {
      color: "white" as const,
      fill: "solid" as const,
      content: "",
      size: "m" as const,
      w: 300,
      h: 200,
      isCodeView: false,
      isLoading: false,
    };
  }

  component(shape: TailwindShape) {
    const theme = useDefaultColorTheme();
    const editor = useEditor();

    const handleGenerate = async () => {
      try {
        // Create a Set to track processed shapes and avoid duplicates
        const connectedShapes: TLShape[] = [];
        // 현재 shape의 연결된 arrow의 목록을 가져온다.
        let arrowBindings = editor.getBindingsToShape(shape.id, "arrow");
        arrowBindings = arrowBindings.filter(
          (binding: any) => binding.props.terminal !== "start"
        );
        console.log("arrowBindings", arrowBindings);

        for (const binding of arrowBindings) {
          console.log("binding", binding);
          // const connectedShape = editor.getShape(binding.fromId)
          const arrowBindings = editor.getBindingsInvolvingShape(
            binding.fromId
          );
          for (const arrowBinding of arrowBindings) {
            if (arrowBinding.toId !== shape.id) {
              const connectedShape = editor.getShape(arrowBinding.toId);
              console.log("connectedShape", connectedShape);
              if (connectedShape) {
                connectedShapes.push(connectedShape);
              }
            }
          }
        }
        const images: ImageInput[] = [];

        // Build prompt from connected shapes
        const promptParts = await Promise.all(
          connectedShapes.map(async (connectedShape: any) => {
            // Extract content based on shape type
            console.log("connectedShape", connectedShape);
            if (connectedShape.type === "textInput")
              return connectedShape.props.text;
            if (connectedShape.type === "image") {
              const base64 = await handleExportBase64(
                editor,
                [connectedShape.id],
                "png"
              );
              images.push({
                data: base64.replace("data:image/png;base64,", ""),
                label: "",
                mimeType: "image/png",
              });
              return "";
            }
            if (connectedShape.type === "frame") {
              const base64 = await handleExportBase64(
                editor,
                [connectedShape.id],
                "png"
              );
              console.log("base64", base64);
              images.push({
                data: base64.replace("data:image/png;base64,", ""),
                label: connectedShape.props.name,
                mimeType: "image/png",
              });
              return "";
            }
            return "";
          })
        );

        const prompt = promptParts.join("\n");

        console.log("Connected shapes:", connectedShapes);
        console.log("Generated prompt:", prompt);

        if (connectedShapes.length === 0) {
          console.warn("No connected shapes found to generate from");
          return;
        }

        this.editor.updateShape({
          id: shape.id,
          type: "tailwind",
          props: {
            ...shape.props,
            isLoading: true,
          },
        });

        const response = await axios.post("/api/generate/tailwind", {
          prompt,
          images: images,
        });
        this.editor.updateShape<TailwindShape>({
          id: shape.id,
          type: "generate",
          props: {
            ...shape.props,
            isLoading: false,
            content: response.data.code,
          },
        });
      } catch (error) {
        console.error("Generation failed:", error);
      }
    };

    let fontSize = "16px";
    switch (shape.props.size) {
      case "s":
        fontSize = "14px";
        break;
      case "m":
        fontSize = "16px";
        break;
      case "l":
        fontSize = "18px";
        break;
      case "xl":
        fontSize = "24px";
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
          <div
            className="relative flex gap-1 justify-between items-center pl-3 pr-1 h-[40px] border-b border-gray-200"
            style={{
              backgroundColor,
              color: headerTextColor,
            }}
          >
            <span className="material-symbols-rounded">drag_indicator</span>
            <h2 onClick={shape.props.onClick}>Tailwindcss Generate</h2>
            <div className="flex-1 flex justify-end gap-1">
              <ToggleButton
                value={shape.props.isCodeView}
                onChange={() => {
                  editor.updateShape({
                    id: shape.id,
                    type: "generate",
                    props: {
                      isCodeView: !shape.props.isCodeView,
                    },
                  });
                }}
              />
              <GenerateButton
                onClick={handleGenerate}
                headerTextColor={headerTextColor}
              />
            </div>
          </div>

          <div
            className="p-2 font-mono overflow-auto flex-1 w-full h-full bg-white whitespace-pre-wrap"
            style={{
              fontSize,
            }}
          >
            {shape.props.isLoading ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="60px"
                    viewBox="0 -960 960 960"
                    width="60px"
                    fill="#5f6368"
                  >
                    <path d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-155.5t86-127Q252-817 325-848.5T480-880q17 0 28.5 11.5T520-840q0 17-11.5 28.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160q133 0 226.5-93.5T800-480q0-17 11.5-28.5T840-520q17 0 28.5 11.5T880-480q0 82-31.5 155t-86 127.5q-54.5 54.5-127 86T480-80Z" />
                  </svg>
                </div>
              </div>
            ) : shape.props.isCodeView ? (
              <div>{shape.props.content}</div>
            ) : (
              <iframe width="100%" height="100%" srcDoc={shape.props.content} />
            )}
          </div>
        </div>
      </HTMLContainer>
    );
  }

  indicator(shape: TailwindShape) {
    return <rect width={shape.props.w} height={shape.props.h} />;
  }
}

function GenerateButton({
  onClick,
  headerTextColor,
}: {
  onClick?: () => void;
  headerTextColor: string;
}) {
  return (
    <button
      className="tlui-button tlui-button__icon absolute top-0 right-0 z-10 pointer-events-auto"
      onTouchStart={(e) => {
        e.stopPropagation(); // 터치 이벤트 전파 방지
      }}
      onPointerDown={(e) => {
        e.stopPropagation(); // 마우스 이벤트 전파 방지
        onClick?.();
      }}
    >
      <span
        className="material-symbols-rounded"
        style={{ color: headerTextColor, fontSize: "32px" }}
      >
        play_arrow
      </span>
    </button>
  );
}

function ToggleButton({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      className="absolute top-1 right-8 z-10 pointer-events-auto h-[32px]  rounded-[8px] flex items-center justify-center hover:bg-gray-100 px-2"
      onTouchStart={(e) => {
        e.stopPropagation(); // 터치 이벤트 전파 방지
      }}
      onPointerDown={(e) => {
        e.stopPropagation(); // 마우스 이벤트 전파 방지
        onChange(!value);
      }}
    >
      {value ? "Code" : "Preview"}
    </button>
  );
}
